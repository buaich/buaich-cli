import inquirer from "inquirer";
import picocolors from "picocolors";

export async function queryName(name?: string): Promise<string> {
  // 是否输入项目名
  let trimedName = (name ?? "").trim();
  if (trimedName) return trimedName;

  // 没有输入项目名，则询问用户输入
  let answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: picocolors.gray("please enter the project name:"),
      default: "my-project",
    },
  ]);

  return String(answers.projectName).trim();
}
