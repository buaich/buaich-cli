import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.join(__dirname, "..", "templates");

export async function createProject({
  cwd,
  projectName,
  template,
  deps = [],
  install = true,
}) {
  if (!cwd) throw new Error("createProject: missing cwd");
  if (!projectName || !String(projectName).trim())
    throw new Error("createProject: projectName is required");
  if (!template) throw new Error("createProject: template is required");

  const targetDir = path.resolve(cwd, projectName);
  const templateDir = resolveTemplateDir(template);

  if (await fs.pathExists(targetDir)) {
    throw new Error(`your project directory already exists: ${targetDir}`);
  }

  await fs.ensureDir(targetDir);
  await fs.copy(templateDir, targetDir, {
    filter: (src) => !src.endsWith("node_modules") && !src.endsWith("dist"),
  });

  await stripGeneratedTsNoCheck(targetDir);

  await patchPackageJson(targetDir, { projectName, template, deps });

  if (install) {
    const pkgManager = await detectPackageManager();
    await runInstall(targetDir, pkgManager);
  }
}

async function stripGeneratedTsNoCheck(targetDir) {
  const candidateFiles = [
    path.join(targetDir, "vite.config.ts"),
    path.join(targetDir, "webpack.config.ts"),
  ];

  await Promise.all(
    candidateFiles.map((filePath) => stripLeadingTsNoCheck(filePath)),
  );
}

async function stripLeadingTsNoCheck(filePath) {
  if (!(await fs.pathExists(filePath))) return;

  const raw = await fs.readFile(filePath, "utf8");
  const normalized = raw.replace(/^\/\/\s*@ts-nocheck\s*\r?\n/, "");
  if (normalized !== raw) {
    await fs.writeFile(filePath, normalized, "utf8");
  }
}

function resolveTemplateDir(template) {
  const mapping = {
    "vue-webpack5": path.join(TEMPLATE_DIR, "vue-webpack5"),
    "react-vite": path.join(TEMPLATE_DIR, "react-vite"),
  };
  const dir = mapping[template];
  if (!dir) throw new Error(`Unknown template: ${template}`);
  return dir;
}

async function patchPackageJson(targetDir, { projectName, template, deps }) {
  const pkgPath = path.join(targetDir, "package.json");
  const pkg = await fs.readJson(pkgPath);

  pkg.name = projectName;

  const selectedDeps = normalizeSelectedDeps(template, deps);
  pkg.dependencies = pkg.dependencies || {};
  for (const depName of selectedDeps) {
    if (
      !pkg.dependencies[depName] &&
      !(pkg.devDependencies && pkg.devDependencies[depName])
    ) {
      pkg.dependencies[depName] = "latest";
    }
  }

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

function normalizeSelectedDeps(template, deps) {
  const unique = new Set(
    (deps || []).map((d) => String(d).trim()).filter(Boolean),
  );

  return [...unique];
}

async function detectPackageManager() {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.includes("pnpm")) return "pnpm";
  if (ua.includes("yarn")) return "yarn";
  return "npm";
}

async function runInstall(targetDir, pkgManager) {
  const cmd = pkgManager;
  const args = pkgManager === "yarn" ? [] : ["install"];
  await spawnAsync(cmd, args, { cwd: targetDir });
}

function spawnAsync(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(`${command} ${args.join(" ")} failed with code ${code}`),
        );
    });
  });
}
