import { Command } from "commander";
import path from "node:path";
import { queryName } from "../prompts/createPrompts.js";

export function registerCreateCommand(program: Command) {
  program
    .command("create")
    .argument("[name]")
    .action((name?: string) => create(name));
}

async function create(name?: string) {
  try {
    const projectName = await queryName(name);
  } catch (error) {
    console.error("Error creating project:", error);
    process.exit(1);
  }
}
