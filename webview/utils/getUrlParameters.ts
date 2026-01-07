function getUrlParameters(url: string) {
  const paramsStr = url.split("?").at(1);
  if (!paramsStr) {
    return [];
  }

  const params = paramsStr.split("&");
  const paramsTable = params.map((param) => {
    let key = "";
    let value = "";

    if (!param.includes("=")) {
      key = param;
    } else {
      [key, value] = param.split("=");
    }

    return {
      key: key,
      value: value
    };
  });

  return paramsTable;
}

export default getUrlParameters;