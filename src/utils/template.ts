import fs from "fs-extra";
import path from "path";

export async function renderTemplate(src: string, dest: string) {
  await fs.ensureDir(dest);
  let entries = await fs.readdir(src);

  for (let entry of entries) {
    let srcPath = path.join(src, entry);
    let desPath = path.join(dest, entry);
    let stat = await fs.stat(srcPath);

    if (stat.isDirectory()) {
      await renderTemplate(srcPath, desPath);
    } else {
      let content = await fs.readFile(srcPath, "utf-8");

      await fs.writeFile(desPath, content, "utf-8");
    }
  }
}
