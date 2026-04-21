import path from "node:path";
import fs from "fs-extra";
import { DEFAULT_TEMPLATE, Template } from "../types/file.js";
import { fileURLToPath } from "node:url";

/**
 * Ensure a clean target directory for the new project.
 * Removes the directory when force is enabled.
 * @param appName Project directory name.
 * @param force Whether to overwrite an existing directory.
 * @returns Absolute path to the created directory.
 * @throws Error when the directory exists and force is not enabled.
 */
export async function createTargetDir(
  appName: string,
  force?: boolean,
): Promise<string> {
  const target = path.resolve(process.cwd(), appName); // target's absolute path
  if (await fs.pathExists(target)) {
    if (force) {
      await fs.remove(target);
    } else {
      throw new Error(
        "Target directory already exists. Use --force to overwrite.",
      );
    }
  }
  await fs.ensureDir(target);
  return target;
}
/**
 * Resolve a template name to its absolute template directory.
 * Defaults to the configured template when input is empty.
 * @param rawTemplate Template name from CLI input.
 * @returns Absolute path to the template directory.
 * @throws Error when the template is not supported.
 */
export function getTemplateDir(rawTemplate?: string): string {
  const TEMPLATE_ROOT = fileURLToPath(new URL("../templates", import.meta.url));
  if (!rawTemplate) return path.join(TEMPLATE_ROOT, DEFAULT_TEMPLATE);

  const template = rawTemplate.trim().toLowerCase();
  if (template === Template.React || template === Template.Vue)
    return path.join(TEMPLATE_ROOT, template);
  throw new Error(`Unsupported template: ${rawTemplate}`);
}
/**
 * Copy template files into the target directory.
 * Filters out node_modules and dist directories.
 * @param templateDir Absolute path to the template source directory.
 * @param targetDir Absolute path to the destination directory.
 * @throws Error when the template directory does not exist.
 */
export async function copy(
  templateDir: string,
  targetDir: string,
): Promise<void> {
  if (!(await fs.pathExists(templateDir))) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  await fs.copy(templateDir, targetDir, {
    filter: (sourcePath) =>
      !sourcePath.includes("node_modules") && !sourcePath.includes("dist"),
  });
}
