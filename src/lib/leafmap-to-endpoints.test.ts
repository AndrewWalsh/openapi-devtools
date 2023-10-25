import { it, expect } from "vitest";
import leafMapToEndpoints from "./leafmap-to-endpoints";
import post, { postHost } from "./__fixtures__/post";
import { createLeaf } from "./store-helpers";
import { LeafMap } from "../utils/types";

it("flattens data into endpoints", () => {
  const leafMap: LeafMap = {
    [postHost]: {
      "/1/2/3": { data: createLeaf(post, { foo: "bar" }) },
      "/1/:param1/3": { data: createLeaf(post, { foo: "bar" }) },
      "/1/2/3/4": { data: createLeaf(post, { foo: "bar" }) },
      "/1/2/3/4a": { data: createLeaf(post, { foo: "bar" }) },
      "/1/2/3/": { data: createLeaf(post, { foo: "bar" }) },
      "/1/2/3/:param4/param5/a/:param7/b": { data: createLeaf(post, { foo: "bar" }) },
    },
  };
  const endpoints = leafMapToEndpoints(leafMap);
  expect(endpoints).toHaveLength(6);
  expect(endpoints).toMatchSnapshot();
});
