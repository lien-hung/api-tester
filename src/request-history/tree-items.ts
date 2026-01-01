import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { IRequestTreeItemState } from "../../src/utils/type";
import { COLLECTION, COMMAND } from "../constants";

export class RequestHistoryTreeItem extends TreeItem {
  public parent = null;
  public contextValue = `${COLLECTION.HISTORY_COLLECTION}.item`;

  constructor(public request: IRequestTreeItemState) {
    super(request.url, TreeItemCollapsibleState.None);
    this.id = request.id;
    this.description = new Date(request.requestedTime).toLocaleString();
    this.tooltip = `${request.method} ${request.url}\nCreated at ${new Date(request.requestedTime).toLocaleString()}`;
    this.command = {
      title: "Open Request",
      command: COMMAND.OPEN_FROM_HISTORY,
      arguments: [
        request.id
      ]
    };
  }
}