import type { Schema } from "genson-js";
import type { RadixRouter } from "radix3";

export type JSONType =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONType }
  | Array<JSONType>;

export type Leaf = {
  // The current pathname of this endpoint, which may be static or parameterised
  pathname: string;
  // Methods such as GET, POST and request values for received status codes
  methods: {
    [method: string]: {
      [statusCode: string]: {
        requestBody?: Schema;
        requestHeaders?: Schema;
        responseBody?: Schema;
        responseHeaders?: Schema;
        queryParameters?: Schema;
      };
    };
  };
};

export enum PartType {
  Static,
  Dynamic,
}
export type Parts = Array<{ part: string; type: PartType }>;
export type Endpoint = {
  host: string;
  fullPath: string;
  parts: Parts;
  leaf: Leaf;
};

export enum Status {
  INIT,
  RECORDING,
  STOPPED,
}

export type RouteData = { data: Leaf };
type Router = RadixRouter<RouteData>;
export type RouterMap = { [host: string]: Router };
export type LeafMap = { [host: string]: Record<string, RouteData> };

export type EndpointsByHost = Array<{ endpoints: Endpoint[]; host: string }>;
