import ora from "ora";
import type { Ora, Spinner, Color } from "ora";
import type { SpinnerName } from "cli-spinners";
import chalk from "chalk";

interface SpinnerConfig {
  text?: string;
  color?: Color;
  spinner?: SpinnerName | Spinner;
  indent?: number;
  hideCursor?: boolean;
  interval?: number;
  stream?: NodeJS.WritableStream;
  isEnable?: boolean;
  isSilent?: boolean;
  discardStdin?: boolean;
  prefixText?: string | (() => string);
  suffixText?: string | (() => string);
}

class BuaichSpinner {
  private spinner: Ora | null = null;
  private default: SpinnerConfig;

  constructor(config: SpinnerConfig = {}) {
    this.default = {
      color: "cyan",
      spinner: "dots",
      ...config,
    };
  }

  start(text: string, config: SpinnerConfig = {}): void {
    if (this.spinner) this.spinner.stop();
    this.spinner = ora({ text, ...this.default, ...config }).start();
  }

  succeed(text: string): void {
    this.spinner?.stopAndPersist({ symbol: "🟢", text: chalk.white(text) });
    this.spinner = null;
  }

  fail(text: string): void {
    this.spinner?.stopAndPersist({ symbol: "🔴", text: chalk.red(text) });
    this.spinner = null;
  }

  info(text: string): void {
    this.spinner?.stopAndPersist({
      symbol: "🟣",
      text: chalk.white(text),
    });
  }

  stop(text: string): void {
    this.spinner?.stopAndPersist({ symbol: "🟠", text: chalk.red(text) });
    this.spinner = null;
  }

  setText(text: string): void {
    if (this.spinner) this.spinner.text = text;
  }

  async with<T>(task: () => Promise<T>, text: string): Promise<T> {
    this.start(text);
    try {
      const result = await task();
      this.succeed("task finished!");
      return result;
    } catch (error) {
      this.fail(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}

export const spinner = new BuaichSpinner({
  color: "blue",
  spinner: {
    interval: 50,
    frames: ["|", "/", "-", "\\"],
  },
  indent: 0,
  hideCursor: true,
  discardStdin: true,
  isEnable: process.stdout.isTTY,
});
