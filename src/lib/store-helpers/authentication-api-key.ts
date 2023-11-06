// import { Authentication, AuthType } from "../../utils/types";
// import { getAuthType } from "./authentication";

// /**
//  * Helpers and utilities for endpoint Authentication details
//  * Modelled on a Security Scheme Object https://spec.openapis.org/oas/v3.1.0#security-scheme-object
//  */
// export interface APIKeyAuth extends Authentication {
//   type: "apiKey";
//   name: string;
// }

// export interface APIKeyAuthHeader extends APIKeyAuth {
//   in: "header";
// }

// export type APIKeyAuthHeaders = APIKeyAuthHeader | undefined;

// export const parseAPIKeyAuthHeader = (
//   header: chrome.devtools.network.Request["request"]["headers"][0]
// ): APIKeyAuthHeaders => {
//   const authType = getAuthType(header.value);
//   if (authType === "basic") {
//     const basicAuth: BasicAuthHeader = {
//       id: AuthType.BASIC,
//       type: "http",
//       in: "header",
//       scheme: "Basic",
//       description: "",
//     };
//     return basicAuth;
//   } else if (authType === "bearer") {
//     const bearerAuth: BearerAuthHeader = {
//       id: AuthType.BEARER,
//       type: "http",
//       in: "header",
//       scheme: "Bearer",
//       description: "",
//     };
//     return bearerAuth;
//   } else if (authType === "digest") {
//     const digestAuth: DigestAuthHeader = {
//       id: AuthType.DIGEST,
//       type: "http",
//       in: "header",
//       scheme: "Digest",
//       description: "",
//     };
//     return digestAuth;
//   }
// };
