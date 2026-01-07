import { IParameterString } from "./type";

function generateParameterString(searchParamsData: IParameterString[]) {
  if (searchParamsData.length === 0) {
    return "";
  }

  const searchParams = searchParamsData.map((param) => param.value ? `${param.key}=${param.value}` : param.key);
  const parameterString = "?" + searchParams.join("&");
  return parameterString;
}

export default generateParameterString;