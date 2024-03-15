import inquirer from "inquirer";
import Todos from "../schema/TodoSchema.js";
import { connectDB, disconnectDB } from "../db/connectDB.js";
import ora from "ora";
import chalk from "chalk";

export const getTaskCode = async () => {
  try {
    const taskCode = await inquirer.prompt([
      {
        name: "code",
        message: "Введите код задачи",
        type: "input",
      },
    ]);

    taskCode.code = taskCode.code.trim();

    return taskCode.code;
  } catch (e) {
    console.log(chalk.redBright("Что-то пошло не так... Ошибка: "), e);
  }
};

export async function deleteTask(deleteTaskCode = undefined) {
  try {
    if (!deleteTaskCode) {
      deleteTaskCode = await getTaskCode();
    }

    await connectDB();

    const spinner = ora("Ищем и удаляем задачу").start();

    const response = await Todos.deleteOne({ code: deleteTaskCode });

    spinner.stop();

    if (response.deletedCount === 0) {
      console.log(
        chalk.redBright("Искомый код не был найден, попробуйте ещё раз")
      );
    } else {
      console.log(chalk.greenBright("Успешное удаление!"));
    }
  } catch (e) {
    console.log(chalk.redBright("Что-то пошло не так... Ошибка: "), e);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}
