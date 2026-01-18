import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { COLLECTION, COMMAND } from "../constants";
import { IRequestTreeItemState } from "../utils/type";
import { getElapsedTime } from "../utils";

export class RequestCollectionItem extends TreeItem {
  public contextValue = `${COLLECTION.REQUEST_COLLECTION}.item`;

  constructor(public request: IRequestTreeItemState, public parent: RequestCollection) {
    super(request.name, TreeItemCollapsibleState.None);
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

export class RequestCollection extends TreeItem {
  public parent = null;
  public contextValue = `${COLLECTION.REQUEST_COLLECTION}.collection`;
  public items: RequestCollectionItem[] = [];

  public addItem(request: IRequestTreeItemState) {
    if (!request.name) {
      return;
    }
    const requestIndex = this.items.findIndex(item => item.request.name === request.name);
    const newRequestItem = new RequestCollectionItem(request, this);
    if (requestIndex !== -1) {
      this.items.splice(requestIndex, 1, newRequestItem);
    } else {
      this.items.push(newRequestItem);
    }
  }

  public renameItem(name: string, newName: string) {
    const requestIndex = this.items.findIndex(item => item.request.name === name);
    if (requestIndex === -1) {
      return;
    }
    const oldRequest = this.items[requestIndex];
    const renamedRequest = { ...oldRequest.request, name: newName };
    this.items.splice(requestIndex, 1, new RequestCollectionItem(renamedRequest, this));
  }

  public deleteItem(name: string) {
    this.items = this.items.filter(item => item.request.name !== name);
  }

  public clearItems() {
    this.items = [];
  }

  constructor(public name: string) {
    super(name, TreeItemCollapsibleState.Expanded);
    this.tooltip = this.name;
  }

  public toJSON() {
    const items = this.items.map((item) => item.request);
    return { [this.name]: items };
  }
}