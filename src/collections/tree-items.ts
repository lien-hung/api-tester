import { TreeItem, TreeItemCollapsibleState } from "vscode";

import { COLLECTION, COMMAND, TYPE } from "../constants";
import { IRequestTreeItemState } from "../utils/type";
import { getElapsedTime } from "../utils";
import { RequestCollectionEntry, RequestFolderEntry, RequestItemEntry } from "./type";

export class RequestItem extends TreeItem {
  public contextValue = `${COLLECTION.REQUEST_COLLECTION}.item`;

  constructor(public request: IRequestTreeItemState, public parent: RequestCollection | RequestFolder) {
    super(request.name, TreeItemCollapsibleState.None);
    this.id = request.id;
    this.parent = parent;
    this.description = getElapsedTime(request.timestamp);
    this.tooltip = `${request.method} ${request.url}\nCreated at ${new Date(request.timestamp).toLocaleString()}`;
    this.command = {
      title: "Open Request",
      command: COMMAND.OPEN_REQUEST,
      arguments: [this]
    };
  }

  public toFileData() {
    return {
      parentId: this.parent.id,
      request: this.request,
    };
  }

  public toExport(): RequestItemEntry {
    const { id, name, timestamp, requestObject } = this.request;
    return { request: { id, name, timestamp, requestObject } };
  }

  public toPostmanJson() {
    const { name, method, requestObject } = this.request;
    const { requestUrl, tableData, authOption, authData, bodyOption, bodyRawData, bodyRawOption, graphqlData } = requestObject;
    const { username, password, token } = authData;

    const noParamUrl = requestUrl.slice(0, requestUrl.includes("?") ? requestUrl.indexOf("?") : undefined);
    const [host, ...path] = noParamUrl
      .replace("http://", "")
      .replace("https://", "")
      .split("/");
    const params = tableData.params
      .filter((p) => p.key)
      .map((p) => ({ key: p.key, value: p.value, disabled: !p.isChecked ? true : undefined }));

    const url = { raw: requestUrl, host: [host], path, query: params };
    const header = tableData.headers
      .filter((h) => h.key)
      .map((h) => ({ key: h.key, value: String(h.value), disabled: !h.isChecked ? true : undefined }));

    let auth;
    switch (authOption) {
      case TYPE.BEARER_TOKEN:
        auth = { type: "bearer", bearer: [{ key: "token", value: token }] };
        break;
      case TYPE.BASIC_AUTH:
        auth = { type: "basic", basic: [{ key: "username", value: username }, { key: "password", value: password }] };
        break;
      default:
        auth = { type: "noauth", noauth: {} };
        break;
    }

    let bodyMode, bodyRawOptionObj, bodyData;
    switch (bodyOption) {
      case TYPE.BODY_FORM_DATA:
        bodyMode = "formdata";
        bodyData = tableData.formData
          .filter((p) => p.key)
          .map((p) => ({
            key: p.key,
            value: p.valueType !== "File" ? String(p.value) : undefined,
            src: p.valueType === "File" ? p.filePath : undefined,
            disabled: !p.isChecked ? true : undefined,
          }));
        break;
      case TYPE.BODY_FORM_URLENCODED:
        bodyMode = "urlencoded";
        bodyData = tableData.formEncoded
          .filter((p) => p.key)
          .map((p) => ({ key: p.key, value: String(p.value), disabled: !p.isChecked ? true : undefined }));
        break;
      case TYPE.BODY_GRAPHQL:
        bodyMode = "raw";
        const graphqlObject = {
          query: graphqlData.query,
          variables: (() => { try { return JSON.parse(graphqlData.variables); } catch { return {}; } })(),
        };
        bodyData = JSON.stringify(graphqlObject);
        break;
      case TYPE.BODY_RAW:
        bodyMode = "raw";
        bodyData = bodyRawData;
        bodyRawOptionObj = bodyRawOption !== "Text" ? { raw: { language: bodyRawOption.toLowerCase() } } : undefined;
        break;
      default:
        break;
    }

    return {
      name,
      request: {
        method, url, header, auth,
        body: bodyMode ? { mode: bodyMode, [bodyMode]: bodyData, options: bodyRawOptionObj } : undefined
      },
      response: []
    };
  }

  public toOpenCollection() {
    const { name, method, requestObject } = this.request;
    const { requestUrl, tableData, authOption, authData, bodyOption, bodyRawOption, bodyRawData, graphqlData } = requestObject;
    const { username, password, token } = authData;

    const url = requestUrl.slice(0, requestUrl.includes("?") ? requestUrl.indexOf("?") : undefined);
    const headers = tableData.headers
      .filter((h) => h.key && h.isChecked)
      .map((h) => ({ name: h.key, value: String(h.value) }));
    const params = tableData.params
      .filter((p) => p.key)
      .map((p) => ({ name: p.key, value: p.value, type: "query", enabled: !p.isChecked ? false : undefined }));

    let auth;
    switch (authOption) {
      case TYPE.BEARER_TOKEN:
        auth = { type: "bearer", token };
        break;
      case TYPE.BASIC_AUTH:
        auth = { type: "basic", username, password };
        break;
      default:
        break;
    }

    let body;
    switch (bodyOption) {
      case TYPE.BODY_FORM_DATA:
        body = {
          type: "multipart-form",
          data: tableData.formData
            .filter((data) => data.key)
            .map((data) => ({
              name: data.key,
              type: data.valueType === "File" ? "file" : "text",
              value: data.valueType === "File" ? [data.filePath] : String(data.value),
              disabled: !data.isChecked,
            })),
        };
        break;
      case TYPE.BODY_FORM_URLENCODED:
        body = {
          type: "form-urlencoded",
          data: tableData.formEncoded
            .filter((data) => data.key)
            .map((param) => ({
              name: param.key,
              value: String(param.value),
              disabled: !param.isChecked,
            })),
        };
        break;
      case TYPE.BODY_GRAPHQL:
        const graphqlObject = {
          query: graphqlData.query,
          variables: (() => { try { return JSON.parse(graphqlData.variables); } catch { return {}; } })(),
        };
        body = { type: "json", data: JSON.stringify(graphqlObject) };
        break;
      case TYPE.BODY_RAW:
        const bodyType = bodyRawOption.toLowerCase();
        body = { type: (["javascript", "html"].includes(bodyType) ? "text" : bodyType), data: bodyRawData };
        break;
      default:
        break;
    }

    return {
      info: { name, type: "http" },
      http: { method, url, headers, params, body, auth },
    };
  }
}

export class RequestFolder extends TreeItem {
  public contextValue = `${COLLECTION.REQUEST_COLLECTION}.folder`;

  constructor(public name: string, public parent: RequestCollection | RequestFolder, id?: string) {
    super(name, TreeItemCollapsibleState.Expanded);
    this.parent = parent;
    this.id = id || crypto.randomUUID();
  }

  public toFileData() {
    return {
      id: this.id,
      name: this.name,
      isFolder: true,
      parentId: this.parent.id,
    };
  }

  public toExport(): RequestFolderEntry {
    return {
      folder: this.name,
      data: [],
    };
  }

  public toPostmanJson() {
    return {
      name: this.name,
      item: [],
    };
  }

  public toOpenCollection() {
    return {
      info: {
        type: "folder",
        name: this.name,
      },
      items: [],
    };
  }
}

export class RequestCollection extends TreeItem {
  public contextValue = `${COLLECTION.REQUEST_COLLECTION}.collection`;
  public parent = null;

  constructor(public name: string, id?: string) {
    super(name, TreeItemCollapsibleState.Expanded);
    this.id = id || crypto.randomUUID();
  }

  public toFileData() {
    return {
      id: this.id,
      name: this.name,
      isCollection: true,
    };
  }

  public toExport(): RequestCollectionEntry {
    return {
      collection: this.name,
      data: [],
    };
  }

  public toPostmanJson() {
    return {
      info: {
        _postman_id: crypto.randomUUID(),
        name: this.name,
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: [],
    };
  }

  public toOpenCollection() {
    return {
      opencollection: "1.0.0",
      info: {
        name: this.name,
      },
      items: [],
    };
  }
}