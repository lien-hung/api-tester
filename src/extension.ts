import * as vscode from 'vscode';

import CollectionsProvider from './collections';
import { COMMAND, MESSAGE, TYPE } from "./constants";
import RequestHistoryProvider from './request-history';
import MainWebviewPanel from './webview-panel';
import { RequestHistoryTreeItem } from './request-history/tree-items';
import { RequestCollection, RequestCollectionItem } from './collections/tree-items';

export async function activate(context: vscode.ExtensionContext) {
	const requestHistoryProvider = new RequestHistoryProvider(context);
	const collectionsProvider = new CollectionsProvider(context);

	const webviewProvider = new MainWebviewPanel(
		context.extensionUri,
		requestHistoryProvider,
		collectionsProvider
	);

	let currentPanel: vscode.WebviewPanel | null = null;

	const handleInputName = async () => {
		const inputName = await vscode.window.showInputBox({
			placeHolder: "New name",
			validateInput: (value) => !value.trim() ? MESSAGE.NAME_EMPTY : null,
		});
		if (!inputName) {
			return;
		}
		return inputName.trim();
	};

	const initializePanel = (collectionName?: string, requestName?: string) => {
		if (currentPanel) {
			currentPanel.reveal(vscode.ViewColumn.One);
		} else {
			currentPanel = webviewProvider.initializeWebview(collectionName, requestName);
			if (webviewProvider.mainPanel) {
				webviewProvider.mainPanel.onDidDispose(() => {
					currentPanel = null;
				}, null);
			}
		}
	};

	const disp_requestHistoryTreeView = vscode.window.createTreeView(
		"apiTesterRequestHistoryTreeView",
		{
			treeDataProvider: requestHistoryProvider,
			showCollapseAll: true
		}
	);

	const disp_collectionsTreeView = vscode.window.createTreeView(
		"apiTesterCollectionsTreeView",
		{
			treeDataProvider: collectionsProvider,
			showCollapseAll: true
		}
	);

	const disp_newRequestCmd = vscode.commands.registerCommand(
		COMMAND.NEW_REQUEST,
		() => initializePanel()
	);

	const disp_openRequestCmd = vscode.commands.registerCommand(
		COMMAND.OPEN_REQUEST,
		(item: RequestHistoryTreeItem | RequestCollectionItem) => {
			if (!currentPanel) {
				if (item instanceof RequestCollectionItem) {
					initializePanel(item.parent.name, item.request.name);
				} else {
					initializePanel();
				}
			}

			setTimeout(() => {
				if (item) {
					currentPanel?.webview.postMessage({
						type: TYPE.TREEVIEW_DATA,
						...item.request.requestObject,
					});
				}
			}, 1000);
		}
	);

	const disp_deleteRequestCmd = vscode.commands.registerCommand(
		COMMAND.DELETE_REQUEST,
		(item: RequestHistoryTreeItem) => {
			requestHistoryProvider.delete(item);
		}
	);

	const disp_refreshCmd = vscode.commands.registerCommand(
		COMMAND.REFRESH,
		() => {
			requestHistoryProvider.refresh();
			collectionsProvider.refresh();
		}
	);

	const disp_clearHistoryCmd = vscode.commands.registerCommand(
		COMMAND.CLEAR_HISTORY,
		async () => {
			const action = await vscode.window.showWarningMessage(
				MESSAGE.CLEAR_HISTORY_REMINDER,
				MESSAGE.YES,
				MESSAGE.NO
			);
			if (action === MESSAGE.YES) {
				requestHistoryProvider.clear();
				await vscode.window.showInformationMessage(MESSAGE.HISTORY_DELETION_COMPLETE);
			}
		}
	);

	const disp_newCollectionCmd = vscode.commands.registerCommand(
		COMMAND.NEW_COLLECTION,
		async () => {
			const collectionName = await handleInputName();
			if (!collectionName) {
				return;
			}
			if (collectionsProvider.isCollectionExist(collectionName)) {
				await vscode.window.showInformationMessage(MESSAGE.COLLECTION_EXISTS);
				return;
			}
			collectionsProvider.add(collectionName);
		}
	);

	const disp_renameCollectionCmd = vscode.commands.registerCommand(
		COMMAND.RENAME_COLLECTION,
		async (collection: RequestCollection) => {
			const newName = await handleInputName();
			if (!newName) {
				return;
			}
			if (collectionsProvider.isCollectionExist(newName)) {
				await vscode.window.showInformationMessage(MESSAGE.COLLECTION_EXISTS);
				return;
			}
			collectionsProvider.renameCollection(collection.name, newName);
		}
	);

	const disp_deleteCollectionCmd = vscode.commands.registerCommand(
		COMMAND.DELETE_COLLECTION,
		async (collection: RequestCollection) => {
			const action = await vscode.window.showWarningMessage(
				MESSAGE.DELETE_COLLECTION_REMINDER,
				MESSAGE.YES,
				MESSAGE.NO
			);
			if (action === MESSAGE.YES) {
				collectionsProvider.delete(collection);
			}
		}
	);

	const disp_newCollectionRequestCmd = vscode.commands.registerCommand(
		COMMAND.NEW_COLLECTION_REQUEST,
		async (collection: RequestCollection) => {
			const requestName = await handleInputName();
			if (!requestName) {
				return;
			}
			if (collectionsProvider.isRequestInCollection(collection.name, requestName)) {
				await vscode.window.showInformationMessage(MESSAGE.REQUEST_EXISTS);
				return;
			}

			initializePanel(collection.name, requestName);
		}
	);

	const disp_clearCollectionItemsCmd = vscode.commands.registerCommand(
		COMMAND.CLEAR_COLLECTION_ITEMS,
		(collection: RequestCollection) => {
			collectionsProvider.clearItems(collection.name);
		}
	);

	const disp_renameRequestCmd = vscode.commands.registerCommand(
		COMMAND.RENAME_REQUEST,
		async (requestItem: RequestCollectionItem) => {
			const collectionName = requestItem.parent.name;
			const requestName = requestItem.request.name;

			const newRequestName = await handleInputName();
			if (!newRequestName) {
				return;
			}

			if (collectionsProvider.isRequestInCollection(collectionName, requestName)) {
				await vscode.window.showInformationMessage(MESSAGE.REQUEST_EXISTS);
				return;
			}
			collectionsProvider.renameItem(collectionName, requestName, newRequestName);
		}
	);

	const disp_deleteCollectionRequestCmd = vscode.commands.registerCommand(
		COMMAND.DELETE_COLLECTION_REQUEST,
		(requestItem: RequestCollectionItem) => {
			collectionsProvider.delete(requestItem);
		}
	);

	const disp_onThemeChangeHandler = vscode.window.onDidChangeActiveColorTheme(() => {
		if (currentPanel) {
			currentPanel.webview.postMessage({
				type: TYPE.THEME_CHANGED
			});
		}
	});

	// Subscribe tree views
	context.subscriptions.push(disp_requestHistoryTreeView);
	context.subscriptions.push(disp_collectionsTreeView);

	// Subscribe commands
	context.subscriptions.push(disp_newRequestCmd);
	context.subscriptions.push(disp_openRequestCmd);
	context.subscriptions.push(disp_deleteRequestCmd);

	context.subscriptions.push(disp_refreshCmd);
	context.subscriptions.push(disp_clearHistoryCmd);

	context.subscriptions.push(disp_newCollectionCmd);
	context.subscriptions.push(disp_renameCollectionCmd);
	context.subscriptions.push(disp_deleteCollectionCmd);
	context.subscriptions.push(disp_newCollectionRequestCmd);
	context.subscriptions.push(disp_clearCollectionItemsCmd);
	context.subscriptions.push(disp_renameRequestCmd);
	context.subscriptions.push(disp_deleteCollectionRequestCmd);

	// Subscribe handlers
	context.subscriptions.push(disp_onThemeChangeHandler);
}

export function deactivate() { }
