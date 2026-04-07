import chalk from "chalk";

export function logInfo(msg) {
  console.log(chalk.blue(msg));
}

export function logError(err) {
  console.error(chalk.red(err.message || err));
}
