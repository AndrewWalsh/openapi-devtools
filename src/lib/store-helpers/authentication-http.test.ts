import { it, expect } from "vitest";
import type { Entry } from 'har-format';
import { parseHTTPAuthHeader } from "./authentication-http";

it("identifies basic auth", () => {
  const header: Entry["request"]["headers"][0] = {
    name: "Authorization",
    value: "Basic 1234",
  };
  const result = parseHTTPAuthHeader(header.value);
  expect(result).toEqual({
    description: "",
    authType: "Basic",
    in: "header",
    scheme: "Basic",
    type: "http",
  });
});

it("identifies bearer auth", () => {
  const header: Entry["request"]["headers"][0] = {
    name: "Authorization",
    value: "Bearer 1234",
  };
  const result = parseHTTPAuthHeader(header.value);
  expect(result).toEqual({
    description: "",
    authType: "Bearer",
    in: "header",
    scheme: "Bearer",
    type: "http",
  });
});

it("identifies digest auth", () => {
  const header: Entry["request"]["headers"][0] = {
    name: "Authorization",
    value: "Digest 1234",
  };
  const result = parseHTTPAuthHeader(header.value);
  expect(result).toEqual({
    description: "",
    authType: "Digest",
    in: "header",
    scheme: "Digest",
    type: "http",
  });
});
