import { JSONType, RouterMap, LeafMap, Endpoint } from "../utils/types";
import {
  parameterise,
  insertLeafMap,
  upsert,
  persistOptions,
} from "./store-helpers";
import { omit, unset } from "lodash";
import leafMapToEndpoints from "./leafmap-to-endpoints";
import stringify from "json-stable-stringify";

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
    this.leafMap = {}; // persist.get() || {};
    this.store = {}; // leafMapToRouterMap(this.leafMap);
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
      const { store, leafMap, disabledHosts } = JSON.parse(json);
      this.disabledHosts = new Set(disabledHosts);
      this.store = store;
      this.leafMap = leafMap;
      return true;
    } catch {
      return false;
    }
  }

  public export = (): string => {
    return stringify({
      store: this.store,
      leafMap: this.leafMap,
      disabledHosts: Array.from(this.disabledHosts),
    });
  };

  public clear(): void {
    this.store = {};
    this.leafMap = {};
    this.disabledHosts = new Set();
    // persist.clear();
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

  public insert(
    harRequest: chrome.devtools.network.Request,
    responseBody: JSONType
  ) {
    const result = upsert({
      harRequest,
      responseBody,
      store: this.store,
      options: this.storeOptions,
    });
    if (!result) return;
    const { insertedPath, insertedLeaf, insertedHost } = result;
    insertLeafMap({
      leafMap: this.leafMap,
      host: insertedHost,
      leaf: insertedLeaf,
      path: insertedPath,
    });
    // persist.set(this.leafMap);
  }

  public parameterise(index: number, path: string, host: string): void {
    const result = parameterise({ store: this.store, index, path, host });
    if (!result) return;
    const { removedPaths, insertedPath, insertedLeaf } = result;
    const unsetLeafMap = (path: string) => unset(this.leafMap[host], path);
    removedPaths.concat([path]).forEach(unsetLeafMap);
    insertLeafMap({
      leafMap: this.leafMap,
      host,
      leaf: insertedLeaf,
      path: insertedPath,
    });
    // persist.set(this.leafMap);
  }

  public setDisabledHosts(disabledHosts: Set<string>): void {
    this.disabledHosts = disabledHosts;
  }
}
