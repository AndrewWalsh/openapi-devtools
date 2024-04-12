import { isEmpty } from "lodash";
import {
  OpenApiBuilder,
  OperationObject,
  PathItemObject,
  SecurityRequirementObject,
  SecuritySchemeObject,
} from "openapi3-ts/oas31";

import {
  createBuilderAndDocRoot,
  createPathParameterTypes,
  createQueryParameterTypes,
  createRequestTypes,
  createResponseTypes,
  createSecuritySchemeTypes,
  formatAuthType,
  shouldIncludeRequestBody,
} from "./endpoints-to-oai31.helpers.js";
import { Options } from "./RequestStore.js";
import { defaultOptions } from "./store-helpers/persist-options.js";
import { AuthTypeString, Endpoint } from "../utils/types.js";

const endpointsToOAI31 = (
  endpoints: Array<Endpoint>,
  options: Options = defaultOptions,
): OpenApiBuilder => {
  const builder = createBuilderAndDocRoot(endpoints);
  const uniqueHosts = new Set<string>();
  const uniqueAuth = new Map<AuthTypeString, SecuritySchemeObject>();

  for (const endpoint of endpoints) {
    const fullPath = `/${endpoint.parts.map((p) => p.part).join("/")}`;
    const pathParameterObjects = createPathParameterTypes(endpoint);
    uniqueHosts.add(endpoint.host);

    const auth = endpoint.data.authentication;
    if (auth) {
      Object.values(auth).forEach((value) => {
        const securitySchema = createSecuritySchemeTypes(value);
        if (securitySchema) {
          uniqueAuth.set(formatAuthType(value.authType), securitySchema);
        }
      });
    }

    for (const method of Object.keys(endpoint.data.methods)) {
      const methodLower = method.toLowerCase();
      const endpointMethod = endpoint.data.methods[method]!;
      const queryParameterObjects = createQueryParameterTypes(
        endpointMethod.queryParameters,
        endpointMethod.examples,
      );
      const requestBody = createRequestTypes(endpointMethod.request, options, endpointMethod.examples);
      const responses = createResponseTypes(
        endpointMethod.response,
        endpointMethod.responseHeaders,
        options,
        endpointMethod.examples,
      );
      const security: SecurityRequirementObject[] = [];
      if (!isEmpty(endpoint.data.authentication)) {
        Object.values(endpoint.data.authentication).forEach((value) => {
          security.push({ [formatAuthType(value.authType)]: [] });
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
      if (requestBody && shouldIncludeRequestBody(method)) {
        operation.requestBody = requestBody;
      }
      // The method (e.g. get) and the operation on it
      const pathItemObject: PathItemObject = {
        [methodLower]: operation,
      };
      const path = endpoint.pathname;
      const { rootDoc } = builder;
      rootDoc.paths = rootDoc.paths || {};
      const specPath = rootDoc.paths?.[path];
      if (specPath) {
        specPath[methodLower as "get"] = operation;
      } else {`1`
        rootDoc.paths[path] = pathItemObject;
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

