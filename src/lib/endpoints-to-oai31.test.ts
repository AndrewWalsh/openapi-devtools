import { it, expect } from "vitest";
import { Validator } from "@seriousme/openapi-schema-validator";
import RequestStore, { Options } from "./RequestStore";
import endpointsToOAI31 from "./endpoints-to-oai31";
import post from "./__fixtures__/post";
import bearer from "./__fixtures__/bearer";
import basic from "./__fixtures__/basic";
import digest from "./__fixtures__/digest";
import { cloneDeep } from "lodash";
import { AuthType } from "../utils/types";
import { defaultOptions } from "./store-helpers/persist-options";

const createRequestStoreWithDefaults = () => {
  const store = new RequestStore();
  const req1 = cloneDeep(post);
  req1.request.url = "https://example.com/api/v1/1a";
  const req2 = cloneDeep(post);
  req2.request.url = "https://example.com/api/v1/2 . ";
  store.insert(req1, { test: "string" });
  store.insert(req2, { test: "string" });
  return store;
};

// test leafMapToEndpoints via the public store method that uses it
it("produces valid openapi 3.1 specifications", () => {
  const validator = new Validator({ strict: true });
  const store = createRequestStoreWithDefaults();
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, defaultOptions);
  expect(validator.validate(oai31.getSpec())).resolves.toEqual({ valid: true });
});

it("sets most recent request when enabled", () => {
  const options: Options = { enableMoreInfo: true };
  const store = new RequestStore(options);
  store.insert(post, { test: "string" });
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, options);
  // @ts-expect-error ignored
  const result = oai31.rootDoc.paths?.['/v1/track'].post?.requestBody?.content['application/json'].example;
  expect(result).toEqual({ test: "integer" });
});

it("sets most recent response when enabled", () => {
  const options: Options = { enableMoreInfo: true };
  const store = new RequestStore(options);
  store.insert(post, { test: "string" });
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, options);
  const result = oai31.rootDoc.paths?.['/v1/track'].post?.responses['200'].content['application/json'].example;
  expect(result).toEqual({ test: "string" });
});

it("sets bearer auth security schema when available", () => {
  const store = new RequestStore();
  store.insert(bearer, { test: "string" });
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, defaultOptions);
  expect(oai31.rootDoc.components?.securitySchemes).toEqual({
    [AuthType.BEARER]: {
      in: "header",
      scheme: "Bearer",
      type: "http",
    },
  });
});

it("sets basic auth security schema when available", () => {
  const store = new RequestStore();
  store.insert(basic, { test: "string" });
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, defaultOptions);
  expect(oai31.rootDoc.components?.securitySchemes).toEqual({
    [AuthType.BASIC]: {
      in: "header",
      scheme: "Basic",
      type: "http",
    },
  });
});

it("sets digest auth security schema when available", () => {
  const store = new RequestStore();
  store.insert(digest, { test: "string" });
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, defaultOptions);
  expect(oai31.rootDoc.components?.securitySchemes).toEqual({
    [AuthType.DIGEST]: {
      in: "header",
      scheme: "Digest",
      type: "http",
    },
  });
});
