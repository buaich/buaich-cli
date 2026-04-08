import prompts from "prompts";
import { logError, logInfo } from "@buaich/cli-shared-utils";
import { createProject } from "@buaich/cli-service";

export async function registerCreateCommand(program) {
  program
    .command("create")
    .argument("[project-name]")
    .action(async (projectName) => {
      try {
        const resolvedProjectName = await ensureProjectName(projectName);
        if (!resolvedProjectName) return;

        const { template } = await prompts({
          type: "select",
          name: "template",
          message: "Select your project template:",
          choices: [
            { title: "Vue3+TS+ Webpack5", value: "vue-webpack5" },
            { title: "React+TS+Vite", value: "react-vite" },
          ],
        });
        if (!template) return;

        const commonDeps = getCommonDepsForTemplate(template);
        const { deps } = await prompts({
          type: "multiselect",
          name: "deps",
          message: "Select common dependencies to install (multiselect):",
          choices: commonDeps.map((d) => ({ title: d, value: d })),
        });

        const { shouldInstall } = await prompts({
          type: "confirm",
          name: "shouldInstall",
          message: "Install dependencies now?",
          initial: true,
        });

        await createProject({
          cwd: process.cwd(),
          projectName: resolvedProjectName,
          template,
          deps: deps || [],
          install: Boolean(shouldInstall),
        });

        logInfo(`created successfully: ${resolvedProjectName}`);
      } catch (err) {
        logError(err);
        process.exitCode = 1;
      }
    });
}

async function ensureProjectName(projectName) {
  if (projectName && String(projectName).trim())
    return String(projectName).trim();

  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "Enter project name:",
    validate: (value) =>
      String(value).trim() ? true : "Project name cannot be empty",
  });

  return name ? String(name).trim() : null;
}

function getCommonDepsForTemplate(template) {
  const base = ["axios", "lodash"];
  if (template === "vue-webpack5") return [...base, "vue-router"];
  return base;
}
