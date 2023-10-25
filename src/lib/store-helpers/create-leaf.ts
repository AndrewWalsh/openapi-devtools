import {
  createSchemaElseUndefined,
  entriesToJSONType,
  parseJSON,
} from "../../utils/helpers";
import { JSONType, Leaf } from "../../utils/types";

function createLeaf(
  harRequest: chrome.devtools.network.Request,
  responseBody: JSONType
): Leaf {
  const method = harRequest.request.method;
  const statusCode = harRequest.response.status.toString();
  const requestBody = parseJSON(harRequest.request.postData?.text);
  const requestHeaders = entriesToJSONType(harRequest.request.headers);
  const responseHeaders = entriesToJSONType(harRequest.response.headers);
  const queryParameters = entriesToJSONType(harRequest.request.queryString);
  const pathname = new URL(harRequest.request.url).pathname;
  const leafPart: Leaf = {
    pathname,
    methods: {
      [method]: {
        [statusCode]: {
          requestBody: createSchemaElseUndefined(requestBody),
          requestHeaders: createSchemaElseUndefined(requestHeaders),
          responseBody: createSchemaElseUndefined(responseBody),
          responseHeaders: createSchemaElseUndefined(responseHeaders),
          queryParameters: createSchemaElseUndefined(queryParameters),
        },
      },
    },
  };
  return leafPart;
}

export default createLeaf;
