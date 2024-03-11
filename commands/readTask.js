import { connectDB, disconnectDB } from "../db/connectDB.js";
import Todos from "../schema/TodoSchema.js";
import chalk from "chalk";
import ora from "ora";

export async function readTask() {
  try {
    await connectDB();

    const spinner = ora("Получаем задачи...").start();

    const todos = await Todos.find({});

    spinner.stop();

    if (todos.length === 0) {
      console.log(chalk.blueBright("У вас ещё нет заведенных задач!"));
    } else {
      todos.forEach((todo) => {
        console.log(
          chalk.cyanBright("Код задачи: ", todo.code) +
            "\n" +
            chalk.blueBright("Название задачи: ", todo.name) +
            "\n" +
            chalk.yellowBright("Описание: ") +
            todo.detail +
            "\n"
        );
      });
    }
  } catch (e) {
    console.log(chalk.redBright("Произошла ошибка: "), e);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}
