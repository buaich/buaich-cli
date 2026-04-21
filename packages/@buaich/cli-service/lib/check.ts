import { BLACK_APP_NAME_SET } from "../types/blacklist.js";

/**
 * Validate an application name against npm and project constraints.
 * Rules include trimming, length, allowed characters, casing, and blacklist.
 * @param appName Proposed application name.
 * @returns True when the name is valid; otherwise false.
 */
export function check(appName: string): boolean {
  /* 
    not null
    Head's and rear's blanks is not valid
    Npm package's biggest name length is 214
    '.' or '_' is not valid in the name's beginning
    '.' is not valid in the name's end
    app name can't be black
  */

  if (!appName) {
    return false;
  }
  let trimmedAppName = appName.trim();
  if (trimmedAppName !== appName) {
    return false;
  }
  if (trimmedAppName.length < 1 || trimmedAppName.length > 214) {
    return false;
  }
  if (trimmedAppName.startsWith(".") || trimmedAppName.startsWith("_")) {
    return false;
  }
  if (trimmedAppName.endsWith(".")) {
    return false;
  }
  if (trimmedAppName !== trimmedAppName.toLowerCase()) {
    return false;
  }
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(trimmedAppName)) {
    return false;
  }
  if (BLACK_APP_NAME_SET.has(trimmedAppName.toLowerCase())) {
    return false;
  }

  return true;
}
