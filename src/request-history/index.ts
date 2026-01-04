import { EventEmitter, TreeDataProvider } from "vscode";
import { RequestHistoryTreeItem } from "./tree-items";
import { getMethodIcons } from "../../src/utils";
import ExtensionStateManager from "../state-manager";
import { COLLECTION } from "../constants";

export default class RequestHistoryProvider implements TreeDataProvider<RequestHistoryTreeItem> {
  private stateManager: ExtensionStateManager;
  private _onDidChangeTreeData: EventEmitter<RequestHistoryTreeItem | undefined> = new EventEmitter();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  public getTreeItem(element: RequestHistoryTreeItem): RequestHistoryTreeItem {
    element.iconPath = getMethodIcons(this.stateManager.getExtensionContext(), element.request.method);
    return element;
  }

  public getChildren(element?: RequestHistoryTreeItem): RequestHistoryTreeItem[] {
    if (!element) {
      const { userRequestHistory } = this.stateManager.getState(COLLECTION.HISTORY_COLLECTION);
      if (!userRequestHistory || userRequestHistory.length === 0) {
        return [];
      }
      return userRequestHistory.map((stateItem) => new RequestHistoryTreeItem(stateItem));
    }
    return [];
  }

  public refresh(item?: RequestHistoryTreeItem) {
    this._onDidChangeTreeData.fire(item);
  }

  public async delete(item: RequestHistoryTreeItem) {
    await this.stateManager.deleteState(COLLECTION.HISTORY_COLLECTION, item.id);
    this.refresh();
  }

  public async clear() {
    await this.stateManager.deleteState(COLLECTION.HISTORY_COLLECTION);
    this.refresh();
  }
  
  constructor(stateManager: ExtensionStateManager) {
    this.stateManager = stateManager;
  }
}