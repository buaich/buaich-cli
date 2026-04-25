import { execa } from "execa";
import { PackageManager } from "../types/file.js";
import { spinner, chalk } from "@buaich/cli-shared-utils";
import fs from "fs-extra";
import path from "node:path";

/**
 * Detect the current package manager from npm user agent.
 * Falls back to npm when detection fails.
 * @returns Detected package manager name.
 */
export function detect(): PackageManager {
  const userAgent = process.env.npm_config_user_agent; //get user agent

  if (userAgent) {
    let manager = userAgent.split("/")[0];
    switch (manager) {
      case "npm":
        return "npm";
      case "pnpm":
        return "pnpm";
      case "yarn":
        return "yarn";
      case "bun":
        return "bun";
      default:
        return "npm";
    }
  }

  return "npm";
}

/**
 * Install dependencies in the target directory.
 * When deps is empty, installs all dependencies from package.json.
 * When deps is provided, installs each dependency explicitly.
 * @param targetDir Absolute path to the project directory.
 * @param deps Dependency names to install.
 * @throws Error when the package manager command fails.
 */
export async function installDeps(
  targetDir: string,
  deps: string[],
): Promise<void> {
  const pm = detect();

  if (deps.length === 0) {
    const pkgPath = path.join(targetDir, "package.json");
    let allDeps: Record<string, string> = {};
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };
    }
    const depNames = Object.keys(allDeps);

    console.log(chalk.cyan(`\n📦 Installing dependencies using ${pm}...`));
    if (depNames.length > 0) {
      console.log(chalk.gray(`Detected: ${depNames.join(", ")}`));
    }

    try {
      await execa(pm, ["install"], {
        cwd: targetDir,
        stdio: "inherit",
        shell: process.platform === "win32",
      });

      if (depNames.length > 0) {
        console.log(chalk.green(`\n✅ Dependencies installed successfully:`));
        depNames.forEach((name) => {
          console.log(
            `${chalk.green("✔")} ${chalk.blue(name)}: ${chalk.gray(allDeps[name])}`,
          );
        });
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to install dependencies.`));
      throw error;
    }
  } else {
    console.log(
      chalk.cyan(`\n📦 Installing specific dependencies using ${pm}:`),
    );
    console.log(chalk.gray(deps.join(", ")));

    for (const dep of deps) {
      spinner.start(`Installing ${dep}...`);
      const args = pm === "npm" ? ["install", dep] : ["add", dep];
      try {
        await execa(pm, args, {
          cwd: targetDir,
          shell: process.platform === "win32",
        });
        spinner.succeed(`${dep} installed successfully`);
      } catch (error) {
        spinner.fail(`Failed to install ${dep}`);
        throw error;
      }
    }

    console.log(chalk.green(`\n😀 All specific dependencies installed:`));
    deps.forEach((dep) => {
      console.log(`${chalk.green("✔")} ${chalk.blue(dep)}`);
    });
  }
}
