export enum BlackAppNameEnum {
  NodeModules = "node_modules",
  Favicon = "favicon.ico",
  PackageJson = "package.json",
  PackageLockJson = "package-lock.json",
  YarnLock = "yarn.lock",
  PnpmLock = "pnpm-lock.yaml",
  Git = ".git",
  DSStore = ".DS_Store",
  ThumbsDb = "thumbs.db",
}

export const BLACK_APP_NAME_SET = new Set<string>(
  Object.values(BlackAppNameEnum),
);
