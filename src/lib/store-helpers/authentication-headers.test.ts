import { it, expect } from "vitest";
import { defaultAuthHeaders } from "../../utils/headers";
import { parseAuthHeaders } from "./authentication-headers";
import { AuthType } from "../../utils/types";

const setupHeaders = () => {
  type H = chrome.devtools.network.Request["request"]["headers"];
  let headers: H = defaultAuthHeaders.map((name) => ({ name, value: "123" }));

  // Duplicate headers should resolve to a single auth header, case insensitive
  const upperCase = headers.map((h) => ({
    name: h.name.toUpperCase(),
    value: h.value,
  }));
  const lowerCase = headers.map((h) => ({
    name: h.name.toLowerCase(),
    value: h.value,
  }));
  headers = [...headers, ...upperCase, ...lowerCase];

  // Add a header that should be ignored
  headers.push({ name: "x-something-else", value: "123" });
  return headers;
};

it("extracts api key names from headers", () => {
  const headers = setupHeaders();
  const result = parseAuthHeaders(headers);
  expect(result).toEqual(
    defaultAuthHeaders.map((name) => ({
      authType: AuthType.APIKEY_HEADER_ + name.toUpperCase(),
      name: name.toUpperCase(),
      type: "apiKey",
      in: "header",
      description: "",
    }))
  );
});

it("extracts api key names from cookies", () => {
  const headers = setupHeaders();
  const cookieidx = headers.findIndex((h) => h.name.toUpperCase() === "COOKIE");
  headers[cookieidx] = {
    name: "cookie",
    value: "foo=bar; equation=E%3Dmc%5E2; sessionid=123",
  };
  const result = parseAuthHeaders(headers);
  const cookieResults = result.filter((api) =>
    api.authType.startsWith(AuthType.APIKEY_COOKIE_)
  );
  expect(cookieResults).toEqual([
    {
      authType: AuthType.APIKEY_COOKIE_ + "SESSIONID",
      description: "",
      in: "cookie",
      name: "sessionid",
      type: "apiKey",
    }
  ]);
});
