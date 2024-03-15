import { disconnectDB, connectDB } from "../db/connectDB.js";
import Todos from "../schema/TodoSchema.js";
import ora from "ora";
import inquirer from "inquirer";
import chalk from "chalk";

const askForDeletion = async () => {
  const deletionComplete = await inquirer.prompt([
    {
      name: "confirm",
      message: "Вы действительно хотите удалить ВСЕ задачи?",
      type: "confirm",
    },
  ]);

  return deletionComplete;
};

export async function clearTasks() {
  try {
    await connectDB();

    const deletionAskRes = await askForDeletion();

    if (deletionAskRes.confirm) {
      const spinner = ora("Чищу задания...").start();
      await Todos.deleteMany({});
      spinner.stop();
      console.log(chalk.greenBright("Задачи успешно очищены!"));
    }
  } catch (e) {
    console.log();
  } finally {
    await disconnectDB();
  }
}
