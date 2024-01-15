import { it, expect } from "vitest";
import { defaultOptions } from "./persist-options";
import postJson from "../__fixtures__/post-application-json";
import postXWWWFormUrlEncoded from "../__fixtures__/post-application-x-www-form-urlencoded";
import createLeaf, { Params } from "./create-leaf";
import { cloneDeep } from "lodash";

it("creates a leaf when request mime starts with application/x-www-form-urlencoded;charset=UTF-8", () => {
  const harRequest = cloneDeep(postXWWWFormUrlEncoded);
  harRequest.request.postData!.mimeType = "application/x-www-form-urlencoded;charset=UTF-8";
  const responseBody: Params["responseBody"] = { test: 1 };
  const options = defaultOptions;
  const leaf = createLeaf({ harRequest, responseBody, options });
  expect(leaf).toMatchSnapshot();
});

it("creates a leaf when request mime = application/x-www-form-urlencoded", () => {
  const harRequest = postXWWWFormUrlEncoded;
  const responseBody: Params["responseBody"] = { test: 1 };
  const options = defaultOptions;
  const leaf = createLeaf({ harRequest, responseBody, options });
  expect(leaf).toMatchSnapshot();
});

it("creates a leaf when mime = application/json;something for req and res", () => {
  const harRequest = cloneDeep(postJson);
  harRequest.request.postData!.mimeType = "application/json;something";
  const responseBody: Params["responseBody"] = { test: 1 };
  const options = defaultOptions;
  const leaf = createLeaf({ harRequest, responseBody, options });
  expect(leaf).toMatchSnapshot();
});

it("creates a leaf when mime = application/json for req and res", () => {
  const harRequest = postJson;
  const responseBody: Params["responseBody"] = { test: 1 };
  const options = defaultOptions;
  const leaf = createLeaf({ harRequest, responseBody, options });
  expect(leaf).toMatchSnapshot();
});
