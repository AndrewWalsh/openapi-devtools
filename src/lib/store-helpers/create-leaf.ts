import decodeUriComponent from "decode-uri-component";
import qs from "fast-querystring";
import type { Entry } from "har-format";

import { filterIgnoreHeaders } from "../../utils/headers.js";
import {
  createSchemaElseUndefined,
  entriesToJSONType,
  parseJSON,
} from "../../utils/helpers.js";
import type { Options } from "../RequestStore.js";
import { Example, JSONType, Leaf } from "../../utils/types.js";
import determineAuthFromHAR from "./authentication.js";

const APPLICATION_JSON = "application/json";
const APPLICATION_X_WWW_FORM_URLENCODED = "application/x-www-form-urlencoded";

export type Params = {
  harRequest: Entry;
  responseBody: JSONType;
  options: Options;
};

const parseRequestBody = (harRequest: Entry): JSONType => {
  const { mimeType, text } = harRequest.request.postData || {};
  if (mimeType?.startsWith(APPLICATION_JSON)) return parseJSON(text);
  else if (mimeType?.startsWith(APPLICATION_X_WWW_FORM_URLENCODED) && text)
    return qs.parse(text) as JSONType;
  return null;
};

function createLeaf({ harRequest, responseBody, options }: Params): Leaf {
  const { enableMoreInfo } = options;
  const authentication = determineAuthFromHAR(harRequest);
  harRequest.request.headers = filterIgnoreHeaders(harRequest.request.headers);
  harRequest.response.headers = filterIgnoreHeaders(
    harRequest.response.headers,
  );
  const method = harRequest.request.method;
  const statusCode = harRequest.response.status.toString();
  const requestMime = harRequest.request.postData?.mimeType;
  const responseMime = harRequest.response.content.mimeType;
  const requestBody = parseRequestBody(harRequest);
  const requestHeaders = entriesToJSONType(harRequest.request.headers);
  const responseHeaders = entriesToJSONType(harRequest.response.headers);
  const queryParameters = entriesToJSONType(harRequest.request.queryString);
  const pathname = decodeUriComponent(new URL(harRequest.request.url).pathname);
  const this_example : Example= {
    id: harRequest.time.toString(),
    path: pathname,
    query_params: queryParameters,
    request: requestBody,
    response: responseBody,
  }
  const leafPart: Leaf = {
    ...(authentication && { authentication }),
    pathname,
    methods: {
      [method]: {
        ...(requestMime && {
          request: {
            [requestMime]: {
              body: createSchemaElseUndefined(requestBody),
              ...(enableMoreInfo && { mostRecent: requestBody }),
            },
          },
        }),
        requestHeaders: createSchemaElseUndefined(requestHeaders),
        response: {
          [statusCode]: {
            [responseMime]: {
              body: createSchemaElseUndefined(responseBody),
              ...(enableMoreInfo && { mostRecent: responseBody }),
            },
          },
        },
        responseHeaders: createSchemaElseUndefined(responseHeaders),
        queryParameters: createSchemaElseUndefined(queryParameters),
        examples: [this_example],
      },
    },
  };
  return leafPart;
}

export default createLeaf;
