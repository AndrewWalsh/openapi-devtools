import { Endpoint } from "../utils/types";
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
import { AuthType } from "../utils/authentication";

const endpointsToOAI31 = (endpoints: Array<Endpoint>): OpenApiBuilder => {
  const builder = createBuilderAndDocRoot(endpoints);
  const uniqueHosts = new Set<string>();
  const uniqueAuth = new Map<AuthType, SecuritySchemeObject>();

  for (const endpoint of endpoints) {
    const fullPath = `/${endpoint.parts.map((p) => p.part).join("/")}`;
    const pathParameterObjects = createPathParameterTypes(endpoint);
    uniqueHosts.add(endpoint.host);
    const auth = endpoint.data.authentication;
    if (auth) {
      const securitySchema = createSecuritySchemeTypes(
        endpoint.data.authentication
      );
      if (securitySchema) {
        uniqueAuth.set(auth.authType, securitySchema);
      }
    }

    for (const [method, statusCodes] of Object.entries(endpoint.data.methods)) {
      for (const [statusCode, schema] of Object.entries(statusCodes)) {
        const methodLower = method.toLowerCase();
        const queryParameterObjects = createQueryParameterTypes(
          endpoint.data.methods[method][statusCode].queryParameters
        );
        const requestBody = createRequestTypes(schema.requestBody);
        const responses = createResponseTypes(
          schema.responseBody,
          schema.responseHeaders,
          statusCode
        );
        const security: SecurityRequirementObject[] | null = endpoint.data
          .authentication
          ? [{ [endpoint.data.authentication.authType]: [] }]
          : null;
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
