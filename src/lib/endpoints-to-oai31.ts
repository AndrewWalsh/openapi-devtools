import { Endpoint, AuthType } from "../utils/types";
import {
  OpenApiBuilder,
  PathItemObject,
  OperationObject,
  SecuritySchemeObject,
  SecurityRequirementObject,
} from "openapi3-ts/oas31";
import {
  shouldIncludeRequestBody,
  createBuilderAndDocRoot,
  createQueryParameterTypes,
  createPathParameterTypes,
  createRequestTypes,
  createResponseTypes,
  createSecuritySchemeTypes,
} from "./endpoints-to-oai31.helpers";
import { Options } from "./RequestStore";
import { defaultOptions } from "./store-helpers/persist-options";
import { isEmpty } from "lodash";

const endpointsToOAI31 = (endpoints: Array<Endpoint>, options: Options = defaultOptions): OpenApiBuilder => {
  const { enableMoreInfo } = options;
  const builder = createBuilderAndDocRoot(endpoints);
  const uniqueHosts = new Set<string>();
  const uniqueAuth = new Map<AuthType, SecuritySchemeObject>();

  for (const endpoint of endpoints) {
    const mostRecentRequest = enableMoreInfo ? endpoint.data.mostRecentRequest : null;
    const mostRecentResponse = enableMoreInfo ? endpoint.data.mostRecentResponse : null;
    const fullPath = `/${endpoint.parts.map((p) => p.part).join("/")}`;
    const pathParameterObjects = createPathParameterTypes(endpoint);
    uniqueHosts.add(endpoint.host);

    const auth = endpoint.data.authentication;
    if (auth) {
      Object.values(auth).forEach(value => {
        const securitySchema = createSecuritySchemeTypes(
          value
        );
        if (securitySchema) {
          uniqueAuth.set(value.id, securitySchema);
        }
      });
    }

    for (const [method, statusCodes] of Object.entries(endpoint.data.methods)) {
      for (const [statusCode, schema] of Object.entries(statusCodes)) {
        const methodLower = method.toLowerCase();
        const queryParameterObjects = createQueryParameterTypes(
          endpoint.data.methods[method][statusCode].queryParameters
        );
        const requestBody = createRequestTypes(schema.requestBody, mostRecentRequest);
        const responses = createResponseTypes(
          schema.responseBody,
          schema.responseHeaders,
          statusCode,
          mostRecentResponse,
        );
        const security: SecurityRequirementObject[] = [];
        if (!isEmpty(endpoint.data.authentication)) {
          Object.values(endpoint.data.authentication).forEach(value => {
            security.push({ [value.id]: [] });
          });
        }
        const operation: OperationObject = {
          summary: fullPath,
          description: `**Host**: http://${endpoint.host}`,
          responses,
          ...(security && { security }),
        };
        const allParameterObjects = [
          ...pathParameterObjects,
          ...queryParameterObjects,
        ];
        if (allParameterObjects.length) {
          operation.parameters = allParameterObjects;
        }
        if (shouldIncludeRequestBody(method) && schema.requestBody) {
          operation.requestBody = requestBody;
        }
        // The method (e.g. get) and the operation on it
        const pathItemObject: PathItemObject = {
          [methodLower]: operation,
        };
        const path = endpoint.pathname;
        // const pathObject: PathObject = {
        //   [path]: pathItemObject,
        // };
        // Assign into doc
        const { rootDoc } = builder;
        rootDoc.paths = rootDoc.paths || {};
        const specPath = rootDoc.paths?.[path];
        if (specPath) {
          specPath[methodLower as "get"] = operation;
        } else {
          rootDoc.paths[path] = pathItemObject;
        }
      }
    }
  }

  uniqueAuth.forEach((auth, key) => {
    if (!builder.rootDoc.components) {
      builder.rootDoc.components = {};
    }
    if (!builder.rootDoc.components.securitySchemes) {
      builder.rootDoc.components.securitySchemes = {};
    }
    builder.rootDoc.components.securitySchemes[key] = auth;
  });

  return builder;
};

export default endpointsToOAI31;
