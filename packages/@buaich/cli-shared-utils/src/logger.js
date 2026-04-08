import chalk from "chalk";

export function logInfo(msg) {
  console.log(chalk.greenBright(msg));
}

export function logError(err) {
  console.error(chalk.red(err.message || err));
}
