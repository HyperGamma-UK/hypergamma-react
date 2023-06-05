// import { enumerateValues, HKEY } from 'registry-js'
import path from "path";
import fs from "fs";
import { homedir } from "os";

export function getSteamPath() {
  try {
    // Linux Installation Location
    if (process.platform === "linux") {
      const steamPath = path.join(homedir(), ".steam", "root", "Steam");
      if (fs.existsSync(steamPath)) return steamPath;

      const altSteamPath = path.join(homedir(), ".local", "share", "Steam");
      if (fs.existsSync(altSteamPath)) return altSteamPath;
      return null;
    }

    if (process.platform === "darwin") {
      const steamPath = path.join(
        homedir(),
        "Library",
        "Application Support",
        "Steam"
      );
      if (fs.existsSync(steamPath)) return steamPath;
      return null;
    }

    if (process.platform !== "win32") throw new Error("Unsupported operating system");

    // Windows Installation Location
    const steamPath = "C:\\Program Files (x86)\\Steam";
    if (fs.existsSync(steamPath)) return steamPath;
    return null;

    // // NOTE: Not working with ESBuild since it has a .node file
    // const entry = enumerateValues(HKEY.HKEY_LOCAL_MACHINE, 'SOFTWARE\\WOW6432Node\\Valve\\Steam').filter(value => value.name === "InstallPath")[0];
    // const value = entry && String(entry.data) || null;
    // return value;
  } catch (e) {
    return null;
  }
}
