import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { IRequestTreeItemState } from "../../src/utils/type";
import { COLLECTION, COMMAND } from "../constants";
import { getElapsedTime } from "../utils";

export class RequestHistoryTreeItem extends TreeItem {
  public parent = null;
  public contextValue = `${COLLECTION.REQUEST_HISTORY}.item`;

  constructor(public request: IRequestTreeItemState) {
    super(request.url, TreeItemCollapsibleState.None);
    this.id = request.id;
    this.description = getElapsedTime(request.requestedTime);
    this.tooltip = `${request.method} ${request.url}\nCreated at ${new Date(request.requestedTime).toLocaleString()}`;
    this.command = {
      title: "Open Request",
      command: COMMAND.OPEN_REQUEST,
      arguments: [this]
    };
  }
}