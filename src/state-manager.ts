import * as vscode from "vscode";

import { COLLECTION } from "./constants";
import { filterDuplicatesFromObject } from "./utils";
import { IRequestTreeItemState } from "./utils/type";

class ExtensionStateManager {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  getExtensionContext() {
    return this.context;
  }

  getState(state: string) {
    const userRequestHistory: IRequestTreeItemState[] | undefined =
      this.context.globalState.get(state);

    return {
      userRequestHistory: userRequestHistory,
    };
  }

  async addState(
    state: string,
    { history }: { history: IRequestTreeItemState[] },
  ) {
    await this.context.globalState.update(state, history);
  }

  async updateState(state: string, id: string, status?: string) {
    const currentTime = new Date().getTime();
    const globalHistoryState: IRequestTreeItemState[] | undefined =
      this.context.globalState.get(state);
    const globalFavoritesState: IRequestTreeItemState[] | undefined =
      this.context.globalState.get(COLLECTION.FAVORITES_COLLECTION);

    if (!globalHistoryState || !globalFavoritesState) {
      return;
    }

    globalHistoryState.map(
      (history) =>
        history.id === id &&
        ((history.isUserFavorite = !history.isUserFavorite),
        (history.favoritedTime = currentTime)),
    );

    await this.context.globalState.update(state, [...globalHistoryState]);

    if (status) {
      const duplicateFilteredUserFavoriteCollection =
        filterDuplicatesFromObject(
          globalHistoryState,
          globalFavoritesState,
          id,
        );

      await this.context.globalState.update(COLLECTION.FAVORITES_COLLECTION, [
        ...duplicateFilteredUserFavoriteCollection,
      ]);
    }
  }

  async deleteState(targetExtensionContext: string, id?: string) {
    const targetGlobalState: IRequestTreeItemState[] | undefined =
      this.context.globalState.get(targetExtensionContext);

    if (!targetGlobalState) {
      return;
    }

    if (!id) {
      await this.context.globalState.update(targetExtensionContext, []);
    } else {
      const filteredExtenionContext = targetGlobalState.filter(
        (history) => history.id !== id,
      );

      await this.context.globalState.update(targetExtensionContext, [
        ...filteredExtenionContext,
      ]);
    }
  }
}

export default ExtensionStateManager;