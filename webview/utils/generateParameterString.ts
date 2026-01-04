import { IParameterString } from "./type";

function generateParameterString(searchParamsData: IParameterString[]) {
  if (searchParamsData.length === 0) {
    return "";
  }

  const searchParams = searchParamsData.map((param) => `${param.key}=${param.value}`);
  const parameterString = "?" + searchParams.join("&");
  return parameterString;
}

export default generateParameterString;