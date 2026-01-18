import fs from "fs";
import os from "os";
import path from "path";

const APITESTER_HOME = path.resolve(os.homedir(), ".api-tester");

if (!fs.existsSync(APITESTER_HOME)) {
  fs.mkdirSync(APITESTER_HOME);
}

export default function getHomePath(...args: string[]) {
  return path.resolve(APITESTER_HOME, ...args);
}