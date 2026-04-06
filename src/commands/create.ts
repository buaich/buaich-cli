import { Command } from "commander";
import path from "node:path";
import { verify } from "../prompts/createPrompts.js";

export function registerCreateCommand(program: Command) {
  program
    .command("create")
    .argument("[name]")
    .action((name?: string) => create(name));
}

async function create(name?: string) {
  try {
    const finalProjectName = await verify(name);
    const projectPath = path.join(process.cwd(), finalProjectName);
    console.log(`Creating project at: ${projectPath}`);
  } catch (error) {
    console.error("Error creating project:", error);
    process.exit(1);
  }
}
