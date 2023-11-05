import type { Schema } from "genson-js";
import type { RadixRouter } from "radix3";
import { Authentication } from './httpauthentication';

export type JSONType =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONType }
  | Array<JSONType>;

export type Leaf = {
  // Authentication details for this endpoint. Multiple auth types per endpoint are not supported
  authentication?: Authentication;
  // The current pathname of this endpoint, which may be static or parameterised
  pathname: string;
  // Methods such as GET, POST and schema values for requests
  // mostRecent
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
  // A host e.g. example.com
  host: string;
  // The full path including parameters, such as /1/:param1/:param2/4
  pathname: string;
  // An array of parts such as 1, 2, and 3 in /1/2/3. Includes their type, static or dynamic (parameter)
  parts: Parts;
  // Data for this endpoint
  data: Leaf;
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
