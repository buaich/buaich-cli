import type { Command } from "commander";
import prompts from "prompts";
import { createProject } from "@buaich/cli-service";

export function registerCreateCommand(program: Command) {
  program
    .command("create")
    .description("Create a new project")
    .argument("[projectName]", "Project directory name")
    .option("-t, --template <template>", "Template name")
    .option("--no-install", "Skip dependency installation")
    .action(async (projectNameArg: string | undefined, options: any) => {
      const projectName = projectNameArg ?? (await askProjectName());
      const template = options.template ?? (await askTemplate());

      await createProject({
        cwd: process.cwd(),
        projectName,
        template,
        deps: [],
        install: options.install,
      });
    });
}

async function askProjectName(): Promise<string> {
  const res = await prompts({
    type: "text",
    name: "projectName",
    message: "Project name:",
    validate: (value) =>
      String(value).trim() ? true : "Project name is required",
  });
  return String(res.projectName).trim();
}

async function askTemplate(): Promise<string> {
  const res = await prompts({
    type: "select",
    name: "template",
    message: "Select a template:",
    choices: [
      { title: "react-vite", value: "react-vite" },
      { title: "vue-webpack5", value: "vue-webpack5" },
    ],
  });
  return String(res.template);
}
