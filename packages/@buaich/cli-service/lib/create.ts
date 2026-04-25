import path from "node:path";
import fs from "fs-extra";
import { createTargetDir, getTemplateDir, copy } from "./file.js";
import { installDeps } from "./install.js";
import { type CreateInfo, CreateOptions } from "../types/create.js";
import { check } from "./check.js";
import { promptFor, spinner } from "@buaich/cli-shared-utils";
import { Template } from "../types/file.js";

/**
 * Create a new project directory from a template.
 * Prompts for missing options, validates name, copies template files,
 * and optionally installs dependencies.
 * @param createInfo Project name and CLI options.
 * @throws Error when the target directory exists without force, or when
 * template copying/installation fails.
 */
export async function create(createInfo: CreateInfo): Promise<void> {
  let appName: string = createInfo.appName;
  let options: CreateOptions = createInfo.options;

  // continuous check your inputted app name until the outcome is true.
  while (!check(appName)) {
    let response = await promptFor<{ appName: string }>({
      type: "text",
      name: "appName",
      message: "What's is your app name?",
    });
    appName = response.appName;
  }

  const targetDir = path.resolve(process.cwd(), appName);
  if ((await fs.pathExists(targetDir)) && !options.force) {
    let response = await promptFor<{ force: boolean }>({
      type: "confirm",
      name: "force",
      message: "Target directory already exists. Overwrite?",
      initial: false,
    });

    if (!response.force) {
      throw new Error("Target directory already exists. Operation cancelled.");
    }
    options.force = true;
  }

  if (!options.template) {
    const response = await promptFor<{ template: string }>({
      type: "select",
      name: "template",
      message: "Pick a template:",
      choices: [
        { title: "Vue (Webpack 5)", value: Template.Vue },
        { title: "React (Vite)", value: Template.React },
      ],
    });
    options.template = response.template;
  }

  if (options.skip === undefined) {
    const response = await promptFor<{ install: boolean }>({
      type: "confirm",
      name: "install",
      message: "Install dependencies?",
      initial: true,
    });
    options.skip = !response.install;
  }

  try {
    spinner.start(`creating ${appName} directory`);
    await createTargetDir(appName, options.force);
    spinner.succeed(`created ${appName} directory`);
    let templateDir = getTemplateDir(options.template);

    await copy(templateDir, targetDir);
    const pkgPath = path.join(targetDir, "package.json");
    if (!(await fs.pathExists(pkgPath))) {
      throw new Error(
        "Template copy failed: package.json not found in target directory.",
      );
    }

    const pkg = await fs.readJson(pkgPath);
    pkg.name = appName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    if (path.basename(templateDir) === Template.Vue) {
      const webpackConfigPath = path.join(targetDir, "webpack.config.ts");
      if (await fs.pathExists(webpackConfigPath)) {
        const webpackConfig = await fs.readFile(webpackConfigPath, "utf8");
        const cleanedWebpackConfig = webpackConfig.replace(
          /^\/\/ @ts-nocheck\r?\n/,
          "",
        );
        if (cleanedWebpackConfig !== webpackConfig) {
          await fs.writeFile(webpackConfigPath, cleanedWebpackConfig, "utf8");
        }
      }
    }

    if (options.skip) return; //skipping to install dependencies

    const deps = options.deps ?? [];
    await installDeps(targetDir, deps);
  } catch (error) {
    spinner.fail(error instanceof Error ? error.message : String(error));
    throw error;
  }
}
