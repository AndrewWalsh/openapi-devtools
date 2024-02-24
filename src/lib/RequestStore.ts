import { JSONType, RouterMap, LeafMap, Endpoint } from "../utils/types";
import {
  parameterise,
  insertLeafMap,
  upsert,
  persistOptions,
  leafMapToRouterMap,
  fastPathParameterIndices,
} from "./store-helpers";
import { omit, unset } from "lodash";
import leafMapToEndpoints from "./leafmap-to-endpoints";
import stringify from "json-stable-stringify";
import type { Entry } from "har-format";
import decodeUriComponent from "decode-uri-component";
import { isValidRequest, parseJSON } from "../utils/helpers";

export type Options = {
  // Includes additional data such as response samples
  enableMoreInfo: boolean;
};

/**
 * RequestStore handles routing to endpoints
 * Optimised for fast lookups & insertion via a Radix Tree
 */
export default class RequestStore {
  private store: RouterMap;
  private leafMap: LeafMap;
  private disabledHosts: Set<string>;
  private storeOptions: Options;

  constructor(storeOptions = persistOptions.get()) {
    this.leafMap = {};
    this.store = {};
    this.disabledHosts = new Set();
    this.storeOptions = storeOptions;
  }

  public options = (options?: Partial<Options>): Readonly<Options> => {
    if (!options) return this.storeOptions;
    this.storeOptions = { ...this.storeOptions, ...options };
    persistOptions.set(this.storeOptions);
    return Object.freeze(this.storeOptions);
  };

  public import(json: string): boolean {
    try {
      const { leafMap, disabledHosts } = JSON.parse(json);
      this.disabledHosts = new Set(disabledHosts);
      this.store = leafMapToRouterMap(leafMap);
      this.leafMap = leafMap;
      return true;
    } catch {
      return false;
    }
  }

  public export = (): string => {
    return stringify({
      leafMap: this.leafMap,
      disabledHosts: Array.from(this.disabledHosts),
    }).trim();
  };

  public clear(): void {
    this.store = {};
    this.leafMap = {};
    this.disabledHosts = new Set();
  }

  public endpoints(): Array<Endpoint> {
    const withoutDisabled = omit(
      this.leafMap,
      Array.from(this.disabledHosts)
    ) as Readonly<typeof this.leafMap>;
    return leafMapToEndpoints(withoutDisabled);
  }

  public get(): Readonly<RouterMap> {
    return omit(this.store, Array.from(this.disabledHosts)) as Readonly<
      typeof this.store
    >;
  }

  public hosts(): Array<string> {
    return Object.keys(this.store);
  }

  public insert(harRequest: Entry, content: string): boolean {
    if (!isValidRequest(harRequest, content)) return false;
    harRequest.request.url = decodeUriComponent(harRequest.request.url);
    const responseBody: JSONType = parseJSON(content);
    const result = upsert({
      harRequest,
      responseBody,
      store: this.store,
      options: this.storeOptions,
    });
    if (!result) return false;
    const { insertedPath, insertedLeaf, insertedHost } = result;
    insertLeafMap({
      leafMap: this.leafMap,
      host: insertedHost,
      leaf: insertedLeaf,
      path: insertedPath,
    });
    let pathname = insertedPath;
    for (const idx of fastPathParameterIndices(pathname)) {
      const newPathname = this.parameterise(idx, pathname, insertedHost);
      if (newPathname) pathname = newPathname;
    }
    return true;
  }

  public parameterise(
    index: number,
    path: string,
    host: string
  ): string | null {
    const result = parameterise({ store: this.store, index, path, host });
    if (!result) return null;
    const { removedPaths, insertedPath, insertedLeaf } = result;
    const unsetLeafMap = (path: string) => unset(this.leafMap[host], path);
    removedPaths.concat([path]).forEach(unsetLeafMap);
    insertLeafMap({
      leafMap: this.leafMap,
      host,
      leaf: insertedLeaf,
      path: insertedPath,
    });
    return insertedPath;
  }

  public setDisabledHosts(disabledHosts: Set<string>): void {
    this.disabledHosts = disabledHosts;
  }
}
