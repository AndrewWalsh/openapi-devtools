import { it, expect, vi } from "vitest";
import { createSimpleRequest } from "./__fixtures__/simple-request";
import RequestStore from "./RequestStore";
import { defaultOptions } from "./store-helpers/persist-options";

vi.mock('./store-helpers/persist-options', async () => {
  const actual = await vi.importActual("./store-helpers/persist-options");
  return {
    // @ts-expect-error ignored
    ...actual,
    get: vi.fn(() => defaultOptions),
    set: vi.fn(),
  };
});

const host = "test.com";
const base = `https://${host}`;
const POST = "POST";

const getResBodyTypes = (store: RequestStore, host: string, path: string, propName = 'foo') => {
  const match = store.get()[host].lookup(path);
  if (!match) throw new Error("Could not match path");
  const properties =
    match.data.methods[POST][200].responseBody?.properties?.[propName].type;
  return properties;
};

it("parameterises and merges paths", () => {
  const store = new RequestStore();
  const req1 = createSimpleRequest(`${base}/1/2/a`);
  const req2 = createSimpleRequest(`${base}/1/2/b`);
  const req3 = createSimpleRequest(`${base}/1/2/c`);
  store.insert(req1, { foo: "bar" });
  store.insert(req2, { foo: 1 });
  store.parameterise(2, "/1/2/a", host);
  store.insert(req3, { foo: null });
  store.parameterise(1, "/1/2/:param2", host);
  const properties = getResBodyTypes(store, host, "/1/zzz/asbds");
  expect(properties).toContain("string");
  expect(properties).toContain("integer");
  expect(properties).toContain("null");
  expect(properties).toHaveLength(3);
});

it("inserts data and can retrieve it", () => {
  const store = new RequestStore();
  const req = createSimpleRequest(`${base}/1/2/a`);
  store.insert(req, { foo: 1 });
  const properties = getResBodyTypes(store, host, "/1/2/a");
  expect(properties).toBe("integer");
});

it("sets leafMap correctly after multiple add and parameterise operations", () => {
  const store = new RequestStore();
  const req1 = createSimpleRequest(`${base}/1/2/a`);
  const req2 = createSimpleRequest(`${base}/staticPath/2/3/4/5`);
  const req3 = createSimpleRequest(`${base}/1/2/b`);
  const req4 = createSimpleRequest(`${base}/1/2/c`);
  const req5 = createSimpleRequest(`${base}/dynamicPath/2/a`);
  const req6 = createSimpleRequest(`${base}/dynamicPath/2/b`);
  store.insert(req1, { foo: "bar" });
  store.insert(req2, { foo: "bar" });
  store.insert(req3, { foo: 1 });
  store.parameterise(2, "/1/2/a", host);
  store.insert(req4, { foo: null });
  store.parameterise(1, "/1/2/:param2", host);
  store.insert(req5, { foo: "bar" });
  store.insert(req6, { foo: 1 });
  store.parameterise(2, "/dynamicPath/2/b", host);
  store.parameterise(1, "/dynamicPath/2/:param2", host);
  const expected = {
    [host]: {
      '/1/:param1/:param2': expect.any(Object),
      '/dynamicPath/:param1/:param2': expect.any(Object),
      '/staticPath/2/3/4/5': expect.any(Object),
    }
  };
  // @ts-expect-error accessing private property
  expect(store.leafMap).toEqual(expected);
  expect(getResBodyTypes(store, host, "/1/x/x")).toEqual(["null", "integer", "string"]);
  expect(getResBodyTypes(store, host, "/dynamicPath/2/x")).toEqual(["integer", "string"]);
  expect(getResBodyTypes(store, host, "/staticPath/2/3/4/5")).toBe('string');
});

it("sets leafMap correctly after many parameterise operations", () => {
  const store = new RequestStore();
  const req1 = createSimpleRequest(`${base}/1/2/3/4/a`);
  const req2 = createSimpleRequest(`${base}/1/2/3/z/b`);
  const req3 = createSimpleRequest(`${base}/1/x/y/z/b`);
  const req4 = createSimpleRequest(`${base}/1/2/b`);
  store.insert(req1, { foo: "bar" });
  store.insert(req2, { foo: null });
  store.insert(req3, { foo: 1 });
  store.insert(req4, { foo: true });
  store.parameterise(4, "/1/2/3/4/a", host);
  store.parameterise(3, "/1/x/y/z/b", host);
  store.parameterise(3, "/1/2/3/4/:param4", host);
  const expected = {
    [host]: {
      '/1/2/3/:param3/:param4': expect.any(Object),
      '/1/2/b': expect.any(Object),
      '/1/x/y/:param3/b': expect.any(Object),
    }
  };
  // @ts-expect-error accessing private property
  expect(store.leafMap).toEqual(expected);
  expect(getResBodyTypes(store, host, "/1/2/3/ANY/ANY")).toEqual(["null", "string"]);
  expect(getResBodyTypes(store, host, "/1/2/b")).toBe("boolean");
  expect(getResBodyTypes(store, host, "/1/x/y/ANY/b")).toBe('integer');
});

it("collapses into a single route when paramaterised", () => {
  const store = new RequestStore();
  const req1 = createSimpleRequest(`${base}/1/2/3/4/a`);
  const req2 = createSimpleRequest(`${base}/1/2/3/4/b`);
  const req3 = createSimpleRequest(`${base}/1/2/3/4/c`);
  store.insert(req1, { foo: "bar" });
  store.insert(req2, { foo: null });
  store.insert(req3, { foo: 1 });
  store.parameterise(3, "/1/2/3/4/a", host);
  store.parameterise(4, "/1/2/3/:param3/a", host);
  const expected = {
    [host]: {
      '/1/2/3/:param3/:param4': expect.any(Object),
    }
  };
  // @ts-expect-error accessing private property
  expect(store.leafMap).toEqual(expected);
  expect(getResBodyTypes(store, host, "/1/2/3/ANY/ANY")).toEqual(["null", "integer", "string"]);
});

it("can parameterise paths that are subsets of another path", () => {
  const store = new RequestStore();
  const req1 = createSimpleRequest(`${base}/1/2/a`);
  const req2 = createSimpleRequest(`${base}/1/2`);
  store.insert(req1, { foo: "bar" });
  store.insert(req2, { foo: 1 });
  store.parameterise(1, "/1/2", host);
  const expected = {
    [host]: {
      '/1/2/a': expect.any(Object),
      '/1/:param1': expect.any(Object),
    }
  };
  // @ts-expect-error accessing private property
  expect(store.leafMap).toEqual(expected);
  expect(getResBodyTypes(store, host, "/1/2/a")).toBe("string");
  expect(getResBodyTypes(store, host, "/1/ANY")).toBe("integer");
});

it("can parameterise paths that exist along the same segment", () => {
  const store = new RequestStore();
  const req1 = createSimpleRequest(`${base}/1/2/a`);
  const req2 = createSimpleRequest(`${base}/1/2`);
  store.insert(createSimpleRequest(`${base}/1`), { foo: null });
  store.insert(createSimpleRequest(`${base}/1/2/3/4`), { foo: null });
  store.insert(req1, { foo: "bar" });
  store.insert(req2, { foo: 1 });
  store.parameterise(1, "/1/2/a", host);
  store.parameterise(1, "/1/2", host);
  const expected = {
    [host]: {
      '/1': expect.any(Object),
      '/1/2/3/4': expect.any(Object),
      '/1/:param1/a': expect.any(Object),
      '/1/:param1': expect.any(Object),
    }
  };
  // @ts-expect-error accessing private property
  expect(store.leafMap).toEqual(expected);
  expect(getResBodyTypes(store, host, "/1/ANY/a")).toBe("string");
  expect(getResBodyTypes(store, host, "/1/ANY")).toBe("integer");
});

it("parameterisation works after export and import", () => {
  const store = new RequestStore();
  const req = createSimpleRequest(`${base}/1/2/a`);
  store.insert(req, { foo: 1 });
  store.parameterise(2, "/1/2/a", host);
  const exported = store.export();
  store.clear();
  store.import(exported);
  store.insert(req, { foo: 1 });
  const expected = {
    [host]: {
      '/1/2/:param2': expect.any(Object),
    }
  };
  // @ts-expect-error accessing private property
  expect(store.leafMap).toEqual(expected);
});
