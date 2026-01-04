import * as vscode from 'vscode';

import { COLLECTION, COMMAND, MESSAGE, TYPE } from "./constants";
import RequestHistoryProvider from './request-history';
import ExtensionStateManager from './state-manager';
import MainWebviewPanel from './webview-panel';
import { filterObjectKey } from './utils';

export async function activate(context: vscode.ExtensionContext) {
	const stateManager = new ExtensionStateManager(context);
	const requestHistoryProvider = new RequestHistoryProvider(stateManager);
	const webviewProvider = new MainWebviewPanel(
		context.extensionUri,
		stateManager,
		requestHistoryProvider
	);

	let currentPanel: vscode.WebviewPanel | null = null;

	if (!stateManager.getState(COLLECTION.HISTORY_COLLECTION)) {
		await stateManager.addState(COLLECTION.HISTORY_COLLECTION, {
			history: []
		});
	}

	const disp_requestHistoryTreeView = vscode.window.createTreeView(
		"apiTesterRequestHistoryTreeView",
		{
			treeDataProvider: requestHistoryProvider,
			showCollapseAll: true
		}
	);

	const disp_mainWebviewPanelCmd = vscode.commands.registerCommand(COMMAND.MAIN_WEBVIEW_PANEL, () => {
		if (currentPanel) {
			currentPanel.reveal(vscode.ViewColumn.One);
		} else {
			currentPanel = webviewProvider.initializeWebview();
			if (webviewProvider.mainPanel) {
				webviewProvider.mainPanel.onDidDispose(() => {
					currentPanel = null;
				}, null);
			}
		}
	});

	const disp_deleteRequestCmd = vscode.commands.registerCommand(COMMAND.DELETE_REQUEST, (item) => {
		requestHistoryProvider.delete(item);
	});

	const disp_clearHistoryCmd = vscode.commands.registerCommand(COMMAND.CLEAR_HISTORY, async () => {
		const action = await vscode.window.showWarningMessage(
			MESSAGE.CLEAR_REMINDER,
			MESSAGE.YES,
			MESSAGE.NO
		);
		if (action === MESSAGE.YES) {
			requestHistoryProvider.clear();
			await vscode.window.showInformationMessage(MESSAGE.DELETION_COMPLETE);
		}
	});

	const disp_openFromHistoryCmd = vscode.commands.registerCommand(COMMAND.OPEN_FROM_HISTORY, (itemId: string) => {
		if (!currentPanel) {
			vscode.commands.executeCommand(COMMAND.MAIN_WEBVIEW_PANEL);
		}

		setTimeout(() => {	
			if (!currentPanel) {
				return;
			}

			const requestHistory = stateManager.getState(COLLECTION.HISTORY_COLLECTION);
			const selectedRequest = filterObjectKey(
				requestHistory,
				itemId,
				COLLECTION.FILTERABLE_OBJECT_KEY
			);
	
			if (selectedRequest) {
				currentPanel.webview.postMessage({
					type: TYPE.SIDEBAR_DATA,
					...selectedRequest.requestObject,
				});
			}
		}, 1000);
	});

	const disp_onThemeChangeHandler = vscode.window.onDidChangeActiveColorTheme(() => {
		if (currentPanel) {
			currentPanel.webview.postMessage({
				type: TYPE.THEME_CHANGED
			});
		}
	});

	context.subscriptions.push(disp_requestHistoryTreeView);

	context.subscriptions.push(disp_mainWebviewPanelCmd);
	context.subscriptions.push(disp_deleteRequestCmd);
	context.subscriptions.push(disp_clearHistoryCmd);
	context.subscriptions.push(disp_openFromHistoryCmd);
	
	context.subscriptions.push(disp_onThemeChangeHandler);
}

export function deactivate() { }
