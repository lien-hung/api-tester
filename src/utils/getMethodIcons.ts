import path from "path";
import { ExtensionContext, Uri } from "vscode";

function getMethodIcons(context: ExtensionContext, method: string) {
  let lightIcon: string;
  let darkIcon: string;
  switch (method) {
    case "GET":
    case "POST":
    case "PUT":
    case "PATCH":
    case "DELETE":
    case "HEAD":
    case "OPTIONS":
      lightIcon = darkIcon = `method-${method.toLowerCase()}.svg`;
      break;

    default:
      lightIcon = "method-custom-light.svg";
      darkIcon = "method-custom-dark.svg";
      break;
  }

  return {
    light: Uri.file(context.asAbsolutePath(path.join("icons/svg", lightIcon))),
    dark: Uri.file(context.asAbsolutePath(path.join("icons/svg", darkIcon)))
  };
}

export default getMethodIcons;