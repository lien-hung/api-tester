const REQUEST = {
  GET: "GET",
  METHOD: "Method",
  REQUEST: "Request",
  URL_REQUEST: "Url Request",

  // Menu options
  PARAMS: "Params",
  AUTH: "Authorization",

  // Body options
  NONE: "None",
  FORM_DATA: "Form Data",
  FORM_URLENCODED: "x-www-form-urlencoded",
  RAW: "Raw",

  // Default headers
  CONTENT_TYPE: "Content-Type",
  CACHE_CONTROL: "Cache-Control",
  ACCEPT: "Accept",
  ACCEPT_ENCODING: "Accept-Encoding",
  CONNECTION: "Connection",

  // Header values
  GZIP: "gzip",
  DEFLATE: "deflate",
  NO_CACHE: "no-cache",
  ANY_MIME_TYPE: "*/*",
  TOKEN: "token",
  USERNAME: "username",
  PASSWORD: "password",
  KEEP_ALIVE: "keep-alive",
  
  // Authorization types
  NO_AUTH: "No Auth",
  BASIC_AUTH: "Basic Auth",
  BEARER_TOKEN: "Bearer Token",
};

export default REQUEST;
