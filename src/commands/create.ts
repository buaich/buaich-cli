import { Command } from "commander";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs-extra";
import { choose, force, query } from "../prompts/create.js";
import { renderTemplate } from "../utils/template.js";

interface CreateOptions {
  template?: string;
}

/**
 * 注册 create 命令
 * @param {Command} program 命令行程序实例
 */
export function registerCreateCommand(program: Command) {
  program
    .command("create")
    .argument("[project-name]")
    .option("-t --template <template>")
    .action((name?: string, options?: CreateOptions) => create(name, options));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function create(projectName?: string, options?: CreateOptions) {
  let name: string = await query(projectName); //项目名称
  let targetDir: string = path.resolve(process.cwd(), name); //目标目录

  // 检查目标目录是否存在
  if (await fs.pathExists(targetDir)) {
    let isForce: boolean = await force(projectName); //强制删除已存在目录信号
    if (!isForce) {
      console.log("create command cancel");
      return;
    } else {
      await fs.remove(targetDir);
    }
  }

  let template: string = options?.template || ""; //模板类型
  if (!template) template = await choose();
  let projectRoot = path.join(__dirname, "../");
  console.log("project rooot: ", projectRoot);
  let templateDir = path.join(projectRoot, "src/templates", template); //模板目录

  if (!(await fs.pathExists(templateDir))) {
    console.error(`template ${template} does not exist!`);
    return;
  }

  console.log("creating...");
  await renderTemplate(templateDir, targetDir);
  console.log("created");
}
