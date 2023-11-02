import { SecuritySchemeType } from "openapi3-ts/oas31";

export enum AuthType {
  BEARER = 'Bearer',
  BASIC = 'Basic',
  DIGEST = 'Digest',
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

export interface BasicAuthHeader extends HTTPAuth {
  scheme: "Basic";
  in: "header";
}

export interface DigestAuthHeader extends HTTPAuth {
  scheme: "Digest";
  in: "header";
}

const getAuthType = (auth: string) => {
  const split = auth.split(' ');
  if (!split.length) return '';
  return split[0].toLowerCase();
};

type ParsedReturnTypes = DigestAuthHeader | BasicAuthHeader | BearerAuthHeader | undefined;

export const parseAuthHeader = (
  headers: chrome.devtools.network.Request["request"]["headers"]
): ParsedReturnTypes => {
  const AUTHORIZATION = "authorization";
  const found = headers.find(
    (head) => head.name.toLowerCase() === AUTHORIZATION
  );
  if (found) {
    const authType = getAuthType(found.value);
    if (authType === "basic") {
      const basicAuth: BasicAuthHeader = {
        authType: AuthType.BASIC,
        type: "http",
        in: "header",
        scheme: "Basic",
        description: '',
      };
      return basicAuth;
    } else if (authType === "bearer") {
      const bearerAuth: BearerAuthHeader = {
        authType: AuthType.BEARER,
        type: "http",
        in: "header",
        scheme: "Bearer",
        description: '',
      };
      return bearerAuth;
    } else if (authType === "digest") {
      const digestAuth: DigestAuthHeader = {
        authType: AuthType.DIGEST,
        type: "http",
        in: "header",
        scheme: "Digest",
        description: '',
      };
      return digestAuth;
    }
  }
};
