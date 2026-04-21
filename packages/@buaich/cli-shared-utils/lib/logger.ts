import pino from "pino";

type CustomLevels = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
type CustomLevelNumbers = Record<CustomLevels, number>;

const customLevels: CustomLevelNumbers = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  customLevels,
  formatters: {
    bindings: (bindings) => ({ pid: bindings.pid, host: bindings.hostname }),
    level: (label) => ({ level: label.toUpperCase() }),
  },
  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "SYS:standard" },
    },
  }),
});
