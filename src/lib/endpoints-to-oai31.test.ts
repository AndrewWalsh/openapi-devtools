import { Validator } from "@seriousme/openapi-schema-validator";
import { cloneDeep } from "lodash";
import { expect, it } from "vitest";

import apikey from "./__fixtures__/apikey.js";
import basic from "./__fixtures__/basic.js";
import bearer from "./__fixtures__/bearer.js";
import digest from "./__fixtures__/digest.js";
import postJson from "./__fixtures__/post-application-json.js";
import { formatAuthType } from "./endpoints-to-oai31.helpers.js";
import endpointsToOAI31 from "./endpoints-to-oai31.js";
import RequestStore, { Options } from "./RequestStore.js";
import { defaultOptions } from "./store-helpers/persist-options.js";
import { AuthType } from "../utils/types.js";

const testStrObj = { test: "string" };
const contentStrTest = JSON.stringify(testStrObj);

const createRequestStoreWithDefaults = () => {
  const store = new RequestStore();
  const req1 = cloneDeep(postJson);
  req1.request.url = "https://example.com/api/v1/1a";
  const req2 = cloneDeep(postJson);
  req2.request.url = "https://example.com/api/v1/2 . ";
  store.insert(req1, contentStrTest);
  store.insert(req2, contentStrTest);
  return store;
};

it("produces valid openapi 3.1 specifications", () => {
  const validator = new Validator({ strict: true });
  const store = createRequestStoreWithDefaults();
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, defaultOptions);
  expect(validator.validate(oai31.getSpec())).resolves.toEqual({ valid: true });
});

it("handles multiple status codes in responses", () => {
  const options: Options = { enableMoreInfo: true };
  const store = new RequestStore(options);
  const req1 = cloneDeep(postJson);
  const req2 = cloneDeep(postJson);
  req2.response.status = 304;
  store.insert(req1, contentStrTest);
  store.insert(req2, contentStrTest);
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, options);
  const result = oai31.rootDoc.paths?.["/v1/track"].post?.responses;
  expect(result?.["200"]).toBeTruthy();
  expect(result?.["304"]).toBeTruthy();
});

it("sets most recent request when enabled", () => {
  const options: Options = { enableMoreInfo: true };
  const store = new RequestStore(options);
  store.insert(postJson, contentStrTest);
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, options);
  const result =
    // @ts-expect-error ignored
    oai31.rootDoc.paths?.["/v1/track"].post?.requestBody?.content[
      "application/json"
    ].example as unknown;
  expect(result).toEqual({ test: "integer" });
});

it("sets most recent response when enabled", () => {
  const options: Options = { enableMoreInfo: true };
  const store = new RequestStore(options);
  store.insert(postJson, contentStrTest);
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, options);
  const result =
    oai31.rootDoc.paths?.["/v1/track"].post?.responses["200"].content[
      "application/json"
    ].example;
  expect(result).toEqual(testStrObj);
});

it("sets bearer auth security schema when available", () => {
  const store = new RequestStore();
  store.insert(bearer, contentStrTest);
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, defaultOptions);
  expect(oai31.rootDoc.components?.securitySchemes).toEqual({
    [formatAuthType(AuthType.APIKEY_HEADER_ + "AUTHORIZATION")]: {
      in: "header",
      name: "AUTHORIZATION",
      type: "apiKey",
    },
    [formatAuthType(AuthType.HTTP_HEADER_BEARER)]: {
      in: "header",
      scheme: "Bearer",
      type: "http",
    },
  });
});

it("sets basic auth security schema when available", () => {
  const store = new RequestStore();
  store.insert(basic, contentStrTest);
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, defaultOptions);
  expect(oai31.rootDoc.components?.securitySchemes).toEqual({
    [formatAuthType(AuthType.APIKEY_HEADER_ + "AUTHORIZATION")]: {
      in: "header",
      name: "AUTHORIZATION",
      type: "apiKey",
    },
    [formatAuthType(AuthType.HTTP_HEADER_BASIC)]: {
      in: "header",
      scheme: "Basic",
      type: "http",
    },
  });
});

it("sets digest auth security schema when available", () => {
  const store = new RequestStore();
  store.insert(digest, contentStrTest);
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, defaultOptions);
  expect(oai31.rootDoc.components?.securitySchemes).toEqual({
    [formatAuthType(AuthType.APIKEY_HEADER_ + "AUTHORIZATION")]: {
      in: "header",
      name: "AUTHORIZATION",
      type: "apiKey",
    },
    [formatAuthType(AuthType.HTTP_HEADER_DIGEST)]: {
      in: "header",
      scheme: "Digest",
      type: "http",
    },
  });
});

it("sets api keys from headers", () => {
  const store = new RequestStore();
  store.insert(apikey, contentStrTest);
  const endpoints = store.endpoints();
  const oai31 = endpointsToOAI31(endpoints, defaultOptions);
  expect(oai31.rootDoc.components?.securitySchemes).toEqual({
    [formatAuthType(AuthType.APIKEY_COOKIE_ + "SESSIONID")]: {
      in: "cookie",
      name: "sessionid",
      type: "apiKey",
    },
    [formatAuthType(AuthType.APIKEY_HEADER_ + "COOKIE")]: {
      in: "header",
      name: "COOKIE",
      type: "apiKey",
    },
    [formatAuthType(AuthType.APIKEY_HEADER_ + "X-API-KEY")]: {
      in: "header",
      name: "X-API-KEY",
      type: "apiKey",
    },
  });
});
