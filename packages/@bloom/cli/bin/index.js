#!/usr/bin/env node

// 从 cli-service 中导入 greet 函数
import { greet } from "@bloom/cli-service";

// 获取命令行参数（例如：bloom --name Alice）
const args = process.argv.slice(2);
const nameIndex = args.indexOf("--name");
const name = nameIndex !== -1 ? args[nameIndex + 1] : undefined;

// 调用 cli-service 的功能
greet(name);
