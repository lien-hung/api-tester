export interface IParameterString {
  optionType: string;
  isChecked: boolean;
  key: string;
  value: string;
}

export interface IBodyRawData {
  text: string;
  javascript: string;
  json: string;
  html: string;
  xml: string;
}

export interface IAuthData {
  username: string;
  password: string;
  token: string;
}