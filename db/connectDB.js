import dotenv from "dotenv";
import mongoose from "mongoose";
import ora from "ora";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export const connectDB = async () => {
  try {
    const spinner = ora("connecting to db...").start();
    await mongoose.connect(process.env.CONNECTION_STRING);
    spinner.stop();
  } catch (e) {
    console.log(chalk.redBright("error while connecting to db: ", e));
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    const spinner = ora("diconnecting from db...").start();
    await mongoose.disconnect();
    spinner.stop();
  } catch (e) {
    console.log(chalk.redBright("error while disconnecting: ", e));
    process.exit(1);
  }
};
