import { Authentication, AuthType } from "../../utils/types";
import { getAuthType } from "./authentication";

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

export type HTTPAuthHeaders =
  | DigestAuthHeader
  | BasicAuthHeader
  | BearerAuthHeader
  | undefined;

export const parseHTTPAuthHeader = (
  header: chrome.devtools.network.Request["request"]["headers"][0]
): HTTPAuthHeaders => {
  const authType = getAuthType(header.value);
  if (authType === "basic") {
    const basicAuth: BasicAuthHeader = {
      id: AuthType.BASIC,
      type: "http",
      in: "header",
      scheme: "Basic",
      description: "",
    };
    return basicAuth;
  } else if (authType === "bearer") {
    const bearerAuth: BearerAuthHeader = {
      id: AuthType.BEARER,
      type: "http",
      in: "header",
      scheme: "Bearer",
      description: "",
    };
    return bearerAuth;
  } else if (authType === "digest") {
    const digestAuth: DigestAuthHeader = {
      id: AuthType.DIGEST,
      type: "http",
      in: "header",
      scheme: "Digest",
      description: "",
    };
    return digestAuth;
  }
};
