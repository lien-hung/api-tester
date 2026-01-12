import * as vscode from "vscode";
import { IExtensionConfig } from "./type";

function getExtensionConfig(): IExtensionConfig {
  const workspaceConfig = vscode.workspace.getConfiguration("api-tester");

  const customMethods = workspaceConfig.get("customMethods", []);

  return { customMethods };
}

export default getExtensionConfig;