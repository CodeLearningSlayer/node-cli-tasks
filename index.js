#!/usr/bin/env node

import { addTask } from "./commands/addTask.js";
import { deleteTask } from "./commands/deleteTask.js";
import { updateTask } from "./commands/updateTask.js";
import { readTask } from "./commands/readTask.js";

import { Command } from "commander";

const program = new Command();

program.name("todo").description("Терминальный таск менеджер").version("1.0.0");

program.command("add").description("Добавить задачу").action(addTask);
program.command("delete").description("Удалить задачу").action(deleteTask);
program.command("update").description("Обновить задачу").action(updateTask);
program.command("read").description("Получить список задач").action(readTask);

program.parse();
