import type { Entry } from 'har-format';
import { Authentication, AuthType } from "../../utils/types";
import { isAuthHeader } from "../../utils/headers";
import { parseHTTPAuthHeader, HTTP } from "./authentication-http";
import cookie from "cookie";

const AUTHORIZATION = "AUTHORIZATION";
const COOKIE = "COOKIE";

/**
 * Helpers and utilities for endpoint Authentication details
 * Modelled on a Security Scheme Object https://spec.openapis.org/oas/v3.1.0#security-scheme-object
 */
export interface APIKeyAuth extends Authentication {
  type: "apiKey";
  name: string;
}

export interface APIKeyAuthHeader extends APIKeyAuth {
  in: "header";
}

export interface APIKeyAuthCookie extends APIKeyAuth {
  in: "cookie";
}

export type APIKey = APIKeyAuthHeader | APIKeyAuthCookie;

// Include cookie keys as api keys when they contain a string below
const cookieSecurityNames = ["token", "session", "id", "jwt", "auth", "cookie", "key", "api"];

const parseAPIKeyAuthCookie = (cookieStr: string): Array<APIKeyAuthCookie> => {
  const cookies = cookie.parse(cookieStr);
  const filteredSecurityNames = Object.keys(cookies).filter((cookieKey) => cookieSecurityNames.some(str => cookieKey.toLowerCase().includes(str)));
  return filteredSecurityNames.map((cookieKey) => {
    const lowerName = cookieKey.toLowerCase();
    const upperName = cookieKey.toUpperCase();
    return {
      authType: AuthType.APIKEY_COOKIE_ + upperName,
      name: lowerName,
      type: "apiKey",
      in: "cookie",
      description: "",
    };
  });
};

type OpenAPIAuth = APIKey | HTTP;

/**
 * Extract all auth info from request headers
 */
export const parseAuthHeaders = (
  headers: Entry["request"]["headers"]
): Array<OpenAPIAuth> => {
  const visited = new Set<string>();
  let results: Array<OpenAPIAuth> = [];
  for (const header of headers) {
    const upperName = header.name.toUpperCase();
    const isAPIKey = isAuthHeader(upperName);
    const wasVisited = visited.has(upperName);
    // Type: http, in: header
    if (upperName === AUTHORIZATION && !wasVisited) {
      const httpAuth = parseHTTPAuthHeader(header.value);
      if (httpAuth) results.push(httpAuth);
    }
    // Type: apiKey, in: cookie
    if (upperName === COOKIE && !wasVisited) {
      results = results.concat(parseAPIKeyAuthCookie(header.value));
    }
    // Type: apiKey, in: header
    if (isAPIKey && !wasVisited) {
      visited.add(upperName);
      const apiKey: APIKeyAuthHeader = {
        authType: AuthType.APIKEY_HEADER_ + upperName,
        name: upperName,
        type: "apiKey",
        in: "header",
        description: "",
      };
      results.push(apiKey);
    }
  }
  return results;
};
