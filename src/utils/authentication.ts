import { SecuritySchemeType } from "openapi3-ts/oas31";
import { parseAuthorizationHeader } from "http-auth-utils";

export enum AuthType {
  BEARER = 'Bearer',
}

// Modelled on a Security Scheme Object https://spec.openapis.org/oas/v3.1.0#security-scheme-object
export interface Authentication {
  // So there is a straightforward way of identifying the type
  authType: AuthType;
  // One of: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
  type: SecuritySchemeType;
  // Could potentially generate some form of description from token values
  description?: string;
  // The name of the header, query or cookie parameter to be used. Used only with apiKey
  name?: string;
  // The location of the API key, "query", "header" or "cookie"
  in: "query" | "header" | "cookie";
  // A valid HTTP auth scheme defined in RFC9110. Only used when type = http
  scheme?: "Basic" | "Bearer" | "Digest";
}

/**
 * Helpers and utilities for endpoint Authentication details
 * Modelled on a Security Scheme Object https://spec.openapis.org/oas/v3.1.0#security-scheme-object
 */
export interface HTTPAuth extends Authentication {
  type: "http";
}

export interface BearerAuthHeader extends HTTPAuth {
  scheme: "Bearer";
  in: "header";
}

type ParsedReturnTypes = BearerAuthHeader | undefined;

export const parseAuthHeader = (
  headers: chrome.devtools.network.Request["request"]["headers"]
): ParsedReturnTypes => {
  const AUTHORIZATION = "authorization";
  const found = headers.find(
    (head) => head.name.toLowerCase() === AUTHORIZATION
  );
  if (found) {
    const authHeader = parseAuthorizationHeader(found.value);
    if (authHeader.type === "Basic") {
      // type BasicAuthType = ReturnType<
      //   typeof parseAuthorizationHeader<typeof BASIC>
      // >;
      // const authData = authHeader as BasicAuthType;
    } else if (authHeader.type === "Bearer") {
      const bearerAuth: BearerAuthHeader = {
        authType: AuthType.BEARER,
        type: "http",
        name: `${AUTHORIZATION}-bearer`,
        in: "header",
        scheme: "Bearer",
        description: '',
      };
      return bearerAuth;
    }
  }
};
