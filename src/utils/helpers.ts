import { Schema, createSchema } from "genson-js";
import { JSONType, DEFAULT_PARAM_NAME } from "@andrew_walsh/openapi-spec-generator";

const isGraphQLURI = (url: string): boolean =>
  url.toLowerCase().endsWith("graphql");
const isJSONFile = (url: string): boolean =>
  url.toLowerCase().endsWith(".json");
const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
const getContent = (entry: chrome.devtools.network.Request): Promise<string> => {
    return new Promise((resolve) => {
        entry.getContent((content) => {
            resolve(content || '');
        });
    });
};
const isValidJSONString = (content: string): boolean => {
    try {
        JSON.parse(content);
        return true;
    } catch (e) {
        return false;
    }
};

const validStatuses = new Set(["GET", "POST", "PUT", "DELETE", "PATCH"]);
const validResourceTypes = new Set(["xhr", "fetch", "document"]);
const isValidStatus = (status: string) => validStatuses.has(status);
export const isValidRequest = async (
  harRequest: chrome.devtools.network.Request
): Promise<boolean> => {
  const isNotAJAXRequest =
    !!harRequest._resourceType &&
    !validResourceTypes.has(harRequest._resourceType);
  if (isNotAJAXRequest) return false;
  const didNotReachServer = !harRequest.serverIPAddress;
  if (didNotReachServer) return false;
  const content = await getContent(harRequest);
  const isNotJSON = harRequest.response.content.mimeType !== "application/json" && !isValidJSONString(content);
  const isNotXWWWFormUrlEncoded = harRequest.request.postData?.mimeType !== "application/x-www-form-urlencoded";
  const isNotValidMime = isNotJSON && isNotXWWWFormUrlEncoded;
  if (isNotValidMime) return false;
  const isNotValidStatus = !isValidStatus(harRequest.request.method);
  if (isNotValidStatus) return false;
  if (!isValidURL(harRequest.request.url)) return false;
  if (isGraphQLURI(harRequest.request.url)) return false;
  if (isJSONFile(harRequest.request.url)) return false;
  return true;
};

export const pathToArray = (pathname: string): Array<string> => {
  return pathname.split("/").slice(1);
};

export const arrayToPath = (parts: Array<string>): string =>
  `/${parts.join("/")}`;

export const getParamName = (index: number): string =>
  `${DEFAULT_PARAM_NAME}${index}`;

export const entriesToJSONType = (
  entries: Array<{ name: string; value: string }>
): JSONType => {
  if (!entries || !entries.length) return null;
  return entries.reduce((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {} as { [k: string]: string });
};

export const parseJSON = (json?: string): JSONType => {
  if (!json) return null;
  try {
    return JSON.parse(json || "");
  } catch (e) {
    return null;
  }
};

export const createSchemaElseUndefined = (
  json: JSONType
): Schema | undefined => {
  if (!json) return undefined;
  return createSchema(json);
};

export const safelyGetURLHost = (url: string): string | null => {
  try {
    const { host } = new URL(url);
    return host;
  } catch (e) {
    return null;
  }
};
