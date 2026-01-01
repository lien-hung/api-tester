import { IParameterString } from "./type";

function generateParameterString(searchParamsData: IParameterString[]) {
  const searchParams = searchParamsData.map((param) => `${param.key}=${param.value}`);
  const parameterString = "?" + searchParams.join("&");
  return parameterString;
}

export default generateParameterString;