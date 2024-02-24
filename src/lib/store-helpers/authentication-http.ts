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

export type HTTP = DigestAuthHeader | BasicAuthHeader | BearerAuthHeader;

export const parseHTTPAuthHeader = (value: string): HTTP | undefined => {
  const authType = getAuthType(value);
  if (authType === "basic") {
    const basicAuth: BasicAuthHeader = {
      authType: AuthType.HTTP_HEADER_BASIC,
      type: "http",
      in: "header",
      scheme: "Basic",
      description: "",
    };
    return basicAuth;
  } else if (authType === "bearer") {
    const bearerAuth: BearerAuthHeader = {
      authType: AuthType.HTTP_HEADER_BEARER,
      type: "http",
      in: "header",
      scheme: "Bearer",
      description: "",
    };
    return bearerAuth;
  } else if (authType === "digest") {
    const digestAuth: DigestAuthHeader = {
      authType: AuthType.HTTP_HEADER_DIGEST,
      type: "http",
      in: "header",
      scheme: "Digest",
      description: "",
    };
    return digestAuth;
  }
};
