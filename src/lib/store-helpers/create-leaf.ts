import decodeUriComponent from "decode-uri-component";
import {
  createSchemaElseUndefined,
  entriesToJSONType,
  parseJSON,
} from "../../utils/helpers";
import { JSONType, Leaf } from "../../utils/types";
import { parseAuthHeader } from "../../utils/httpauthentication";
import { filterIgnoreHeaders } from '../../utils/headers';

function createLeaf(
  harRequest: chrome.devtools.network.Request,
  responseBody: JSONType
): Leaf {
  const authentication = parseAuthHeader(harRequest.request.headers);
  harRequest.request.headers = filterIgnoreHeaders(harRequest.request.headers);
  harRequest.response.headers = filterIgnoreHeaders(harRequest.response.headers);
  const method = harRequest.request.method;
  const statusCode = harRequest.response.status.toString();
  const requestBody = parseJSON(harRequest.request.postData?.text);
  const requestHeaders = entriesToJSONType(harRequest.request.headers);
  const responseHeaders = entriesToJSONType(harRequest.response.headers);
  const queryParameters = entriesToJSONType(harRequest.request.queryString);
  const pathname = decodeUriComponent(new URL(harRequest.request.url).pathname);
  const leafPart: Leaf = {
    ...(authentication && { authentication }),
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
