import { MESSAGE, TYPE } from "../constants";
import { IRequestData } from "./type";

async function generateResponseObject(
  request: IRequestData | undefined,
) {
  if (!request) {
    return;
  }

  const sentTime = new Date().getTime();

  try {
    const response = (request.method === "GET" || request.method === "HEAD")
      ? await fetch(request.url)
      : await fetch(
        request.url,
        {
          method: request.method,
          headers: request.headers,
          body: request.data
        }
      );

    const receivedTime = new Date().getTime();
    const totalRequestTime = receivedTime - sentTime;

    const headersArray: any[] = [];
    response.headers.forEach((value, key) => {
      headersArray.push({ key: key, value: value });
    });
    const headersSize = headersArray.length;
    const responseBody = await response.text();

    const responseDataObject: any = {
      data: responseBody,
      headers: headersArray,
      statusCode: response.status,
      statusText: response.statusText,
    };

    responseDataObject.responseSize = Buffer.from(JSON.stringify(responseDataObject)).length;
    responseDataObject.type = TYPE.RESPONSE;
    responseDataObject.headersLength = headersSize;
    responseDataObject.requestTime = totalRequestTime;

    return responseDataObject;
  } catch (error: any) {
    return {
      type: MESSAGE.ERROR,
      message: error.message,
    };
  }
}

export default generateResponseObject;
