import decodeUriComponent from "decode-uri-component";
import {
  createSchemaElseUndefined,
  entriesToJSONType,
  parseJSON,
} from "../../utils/helpers";
import { JSONType, Leaf } from "../../utils/types";
import determineAuthFromHAR from "./authentication";
import { filterIgnoreHeaders } from "../../utils/headers";
import type { Options } from "../RequestStore";
import type { Entry } from "har-format";

export type Params = {
  harRequest: Entry;
  responseBody: JSONType;
  options: Options;
};

function createLeaf({ harRequest, responseBody, options }: Params): Leaf {
  const { enableMoreInfo } = options;
  const authentication = determineAuthFromHAR(harRequest);
  harRequest.request.headers = filterIgnoreHeaders(harRequest.request.headers);
  harRequest.response.headers = filterIgnoreHeaders(
    harRequest.response.headers
  );
  const method = harRequest.request.method;
  const statusCode = harRequest.response.status.toString();
  const requestMime = harRequest.request.postData?.mimeType;
  const responseMime = harRequest.response.content.mimeType;
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
            [responseMime]: {
              body: createSchemaElseUndefined(responseBody),
              ...(enableMoreInfo && { mostRecent: responseBody }),
            },
          },
          responseHeaders: createSchemaElseUndefined(responseHeaders),
          queryParameters: createSchemaElseUndefined(queryParameters),
        },
      },
    },
  };
  return leafPart;
}

export default createLeaf;
