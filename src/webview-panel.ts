import * as vscode from "vscode";

import { COLLECTION, COMMAND, MESSAGE, NAME, TYPE } from "./constants";
import {
  generateResponseObject,
  getBody,
  getHeaders,
  getNonce,
  getUrl,
} from "./utils";
import { IRequestHeaderInformation, IRequestObjectType } from "./utils/type";
import ExtensionStateManager from "./state-manager";
import RequestHistoryProvider from "./request-history";

class MainWebviewPanel {
  private url: string = "";
  private body: string | FormData | URLSearchParams = "";
  private method: string = "";
  private headers: IRequestHeaderInformation = { key: "" };
  public mainPanel: vscode.WebviewPanel | null = null;
  private extensionUri;
  public stateManager;
  private requestHistoryProvider;

  constructor(
    extensionUri: vscode.Uri,
    stateManager: ExtensionStateManager,
    requestHistoryProvider: RequestHistoryProvider
  ) {
    this.extensionUri = extensionUri;
    this.stateManager = stateManager;
    this.requestHistoryProvider = requestHistoryProvider;
  }

  initializeWebview() {
    this.mainPanel = vscode.window.createWebviewPanel(
      TYPE.WEBVIEW_TYPE,
      NAME.MAIN_PANEL_NAME,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this.extensionUri, "media"),
          vscode.Uri.joinPath(this.extensionUri, "dist"),
        ],
      },
    );

    this.mainPanel.webview.html = this.getHtmlForWebview(
      this.mainPanel.webview,
    );

    this.mainPanel.iconPath = vscode.Uri.joinPath(
      this.extensionUri,
      "icons/images/apitester-icon.png",
    );

    this.receiveWebviewMessage();

    return this.mainPanel;
  }

  private receiveWebviewMessage() {
    if (!this.mainPanel) {
      return;
    }

    this.mainPanel.webview.onDidReceiveMessage(
      ({ requestMethod, requestUrl, authOption, authData, bodyOption, bodyRawOption, bodyRawData, keyValueTableData, command }) => {
        if (command === COMMAND.ALERT_COPY) {
          vscode.window.showInformationMessage(MESSAGE.COPY_SUCCESFUL_MESSAGE);
          return;
        }

        if (requestUrl.length === 0) {
          vscode.window.showWarningMessage(MESSAGE.WARNING_MESSAGE);
          return;
        }

        const requestObject = {
          requestMethod,
          requestUrl,
          authOption,
          authData,
          bodyOption,
          bodyRawOption,
          bodyRawData,
          keyValueTableData,
          command,
        };

        this.url = getUrl(requestUrl);
        this.method = requestMethod;
        this.headers = getHeaders(keyValueTableData, authOption, authData);
        
        // @ts-expect-error
        this.body = getBody(
          keyValueTableData,
          bodyOption,
          bodyRawOption,
          bodyRawData
        );

        this.postWebviewMessage(requestObject);
      },
    );
  }

  private async postWebviewMessage(requestObject: IRequestObjectType) {
    const { userRequestHistory } = this.stateManager.getState(
      COLLECTION.HISTORY_COLLECTION
    );
    const requestData = {
      url: this.url,
      method: this.method,
      headers: this.headers,
      data: this.body,
      responseType: TYPE.TEXT
    };
    
    const responseObject = await generateResponseObject(requestData);
    const requestedTime = new Date().getTime();

    if (responseObject && responseObject.type !== MESSAGE.ERROR) {
      if (!userRequestHistory) {
        await this.stateManager.addState(
          COLLECTION.HISTORY_COLLECTION,
          {
            history: [
              {
                ...requestData,
                requestedTime,
                favoritedTime: null,
                isUserFavorite: false,
                id: crypto.randomUUID(),
                requestObject,
              },
            ],
          },
        );
      } else {
        if (!userRequestHistory) {
          return;
        }

        await this.stateManager.addState(
          COLLECTION.HISTORY_COLLECTION,
          {
            history: [
              {
                ...requestData,
                requestedTime,
                favoritedTime: null,
                isUserFavorite: false,
                id: crypto.randomUUID(),
                requestObject,
              },
              ...userRequestHistory,
            ],
          },
        );
      }

      if (this.mainPanel) {
        this.mainPanel.webview.postMessage(responseObject);
        this.requestHistoryProvider.refresh();
      }
    }
  }

  private getHtmlForWebview(panel: vscode.Webview) {
    const scriptPath = vscode.Uri.joinPath(
      this.extensionUri,
      "dist",
      "bundle.js",
    );
    const resetCssPath = vscode.Uri.joinPath(
      this.extensionUri,
      "media",
      "reset.css",
    );
    const vscodeStylesCssPath = vscode.Uri.joinPath(
      this.extensionUri,
      "media",
      "vscode.css",
    );

    const resetCssSrc = panel.asWebviewUri(resetCssPath);
    const mainStylesCssSrc = panel.asWebviewUri(vscodeStylesCssPath);
    const scriptSrc = panel.asWebviewUri(scriptPath);
    const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>API Tester</title>
          <link href="${resetCssSrc}" rel="stylesheet">
          <link href="${mainStylesCssSrc}" rel="stylesheet">
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
          </script>
          <script src="${scriptSrc}" nonce="${nonce}"></script>
        </body>
      </html>`;
  }
}

export default MainWebviewPanel;