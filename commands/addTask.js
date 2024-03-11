import inquirer from "inquirer";
import { connectDB, disconnectDB } from "../db/connectDB.js";
import Todos from "../schema/TodoSchema.js";
import ora from "ora";
import chalk from "chalk";

async function input() {
  const answers = await inquirer.prompt([
    { name: "name", message: "Введите название задачи", type: "input" },
    {
      name: "detail",
      message: "Введите подробности задачи",
      type: "input",
    },
  ]);

  return answers;
}

const askQuestions = async () => {
  const todoArray = [];
  let loop = false;

  do {
    const userRes = await input();
    todoArray.push(userRes);

    const confirmQuestion = await inquirer.prompt([
      {
        name: "confirm",
        message: "Хотите добавить ещё задачу?",
        type: "confirm",
      },
    ]);

    if (confirmQuestion.confirm) {
      loop = true;
    } else {
      loop = false;
    }
  } while (loop);

  return todoArray;
};

export async function addTask() {
  try {
    const userResponse = await askQuestions();

    await connectDB(); // попробовать вынести в интерсептор

    let spinner = ora("Создаем задачи...").start();

    for (let i = 0; i < userResponse.length; i++) {
      const response = userResponse[i];
      await Todos.create(response);
    }

    spinner.stop();
    console.log(chalk.greenBright("Задачи созданы!"));
  } catch (e) {
    console.log(chalk.redBright("Что-то пошло не так, ошибка: ", e));
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}
