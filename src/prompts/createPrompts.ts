import inquirer from "inquirer";

export async function verify(name?: string): Promise<string> {
  // 是否输入项目名
  let trimedName = (name ?? "").trim();
  if (trimedName) return trimedName;

  // 没有输入项目名，则询问用户输入
  let answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      default: "demo",
    },
  ]);

  return String(answers.projectName).trim();
}
