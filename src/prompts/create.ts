import inquirer from "inquirer";
import picocolors from "picocolors";

export async function query(projectName?: string): Promise<string> {
  // 是否输入项目名
  let trimedprojectName = (projectName ?? "").trim();
  if (trimedprojectName) return trimedprojectName;

  // 没有输入项目名，则询问用户输入
  let { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: picocolors.gray("please enter the project name:"),
      default: "my-project",
    },
  ]);

  return String(name).trim();
}

export async function force(projectName?: string): Promise<boolean> {
  let { force } = await inquirer.prompt([
    {
      type: "confirm",
      name: "force",
      message: `dir ${projectName} exists, do you want to cover?`,
      default: false,
    },
  ]);

  return force;
}

export async function choose(): Promise<string> {
  let { template } = await inquirer.prompt([
    {
      type: "select",
      name: "template",
      message: "Please choose your project template:",
      choices: [
        { name: "Vue", value: "vue" },
        { name: "React", value: "react" },
      ],
    },
  ]);

  return template;
}
