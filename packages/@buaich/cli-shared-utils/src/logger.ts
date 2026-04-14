import chalk from "chalk";

type LogFn = (...args: unknown[]) => void;

export const logger: {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  success: LogFn;
} = {
  info: (...args) => console.log(chalk.cyan("[info]"), ...args),
  warn: (...args) => console.warn(chalk.yellow("[warn]"), ...args),
  error: (...args) => console.error(chalk.red("[error]"), ...args),
  success: (...args) => console.log(chalk.green("[success]"), ...args),
};
