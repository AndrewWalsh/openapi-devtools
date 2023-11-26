import { it, expect } from "vitest";
import { defaultOptions } from "./persist-options";
import postJson from "../__fixtures__/post-application-json";
import createLeaf, { Params } from "./create-leaf";

it("creates a leaf", () => {
  const harRequest = postJson;
  const responseBody: Params["responseBody"] = { test: 1 };
  const options = defaultOptions;
  const leaf = createLeaf({ harRequest, responseBody, options });
  expect(leaf).toEqual({
    pathname: "/v1/track",
    methods: {
      POST: {
        "200": {
          request: {
            "application/json": {
              body: {
                type: "object",
                properties: {
                  test: {
                    type: "string",
                  },
                },
                required: ["test"],
              },
            },
          },
          requestHeaders: {
            type: "object",
            properties: {
              anonymousid: {
                type: "string",
              },
            },
            required: ["anonymousid"],
          },
          response: {
            "application/json": {
              body: {
                type: "object",
                properties: {
                  test: {
                    type: "integer",
                  },
                },
                required: ["test"],
              },
            },
          },
          responseHeaders: undefined,
          queryParameters: {
            type: "object",
            properties: {
              alt: {
                type: "string",
              },
              key: {
                type: "string",
              },
            },
            required: ["alt", "key"],
          },
        },
      },
    },
  });
});
