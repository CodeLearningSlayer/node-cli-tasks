import inquirer from "inquirer";
import Todos from "../schema/TodoSchema.js";
import chalk from "chalk";
import { getTaskCode } from "./deleteTask.js";
import ora from "ora";
import { connectDB, disconnectDB } from "../db/connectDB.js";

async function askUpdateQuestion(todo) {
  try {
    const update = await inquirer.prompt([
      {
        name: "name",
        message: "Обновить имя?",
        type: "input",
        default: todo.name,
      },
      {
        name: "detail",
        message: "Обновить описание?",
        type: "input",
        default: todo.detail,
      },
      {
        name: "status",
        message: "Обновить статус?",
        type: "list",
        choices: ["pending", "completed"],
      },
    ]);

    return update;
  } catch (e) {
    console.log(chalk.redBright("Что-то пошло не так... Ошибка "), e);
  }
}

export async function updateTask() {
  try {
    const userCode = await getTaskCode();

    await connectDB();

    const spinner = ora("Ищем задачу...").start();

    const todo = await Todos.findOne({ code: userCode });

    spinner.stop();

    if (!todo) {
      console.log(
        chalk.redBright(
          "Задача не была найдена, проверьте правильность введенного кода"
        )
      );
    } else {
      console.log(
        chalk.blueBright("Введите обновленные данные для выбранной задачи")
      );

      const update = await askUpdateQuestion(todo);

      console.log(update);

      if (update.completed) {
        spinner.text = "Удаляем задачу";
        spinner.start();

        await Todos.deleteOne({ _id: todo._id });

        spinner.stop();
        console.log(chalk.greenBright("Задача удалена успешно!"));
      } else {
        spinner.text = "Обновляем задачу";
        spinner.start();

        await Todos.updateOne({ _id: todo._id }, update, {
          runValidators: true,
        });
        spinner.stop();
        console.log(chalk.greenBright("Задача успешно обновлена!"));
      }
    }
  } catch (e) {
    console.log(chalk.redBright("Что-то пошло не так..."), e);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}
