import { Schema, mergeSchemas } from "genson-js";
import type { Leaf } from "../../utils/types";

type Data = Leaf["methods"]["get"]["200"];
type Req = Leaf["methods"]["get"]["200"]["request"];
type Res = Leaf["methods"]["get"]["200"]["response"];
type Body = Leaf["methods"]["get"]["200"]["response"]['mediaType'];

const mergeAuthentication = (dest: Leaf, src: Leaf): void => {
  if (!src.authentication) return;
  if (!dest.authentication) dest.authentication = {};
  Object.entries(src.authentication).forEach(([key, value]) => {
    dest.authentication![key] = value;
  });
};

const mergeReqRes = (
  reqOrRes: "request" | "response",
  dest: Data,
  src: Req | Res
) => {
  type Entries = Array<[string, Body]>;
  (Object.entries(src!) as Entries).forEach(([mediaType, srcData]) => {
    if (!srcData || !srcData.body) return;
    if (!dest[reqOrRes]![mediaType]) {
      dest[reqOrRes]![mediaType] = srcData;
    } else {
      dest[reqOrRes]![mediaType].body = mergeSchemas([
        dest[reqOrRes]![mediaType].body!,
        srcData.body,
      ]);
      dest[reqOrRes]![mediaType].mostRecent = srcData.mostRecent;
    }
  });
};

export const mergeLeaves = (dest: Leaf, src: Leaf): Leaf => {
  mergeAuthentication(dest, src);
  for (const [method, statusCodeObj] of Object.entries(src.methods)) {
    if (!dest.methods[method]) {
      dest.methods[method] = statusCodeObj;
      continue;
    }
    for (const [statusCode, schemaObj] of Object.entries(statusCodeObj)) {
      const destSchema = dest.methods[method][statusCode];
      if (!destSchema) {
        dest.methods[method][statusCode] = schemaObj;
        continue;
      }
      type DestSchemaEntries = Array<
        [keyof typeof destSchema, Schema | Req | Res]
      >;
      for (const [key, schema] of Object.entries(
        schemaObj
      ) as DestSchemaEntries) {
        if (key === "request") {
          if (!destSchema.request) destSchema.request = {};
          mergeReqRes("request", destSchema, schema as Req);
        } else if (key === "response") {
          mergeReqRes("response", destSchema, schema as Res);
        } else if (destSchema[key]) {
          destSchema[key] = mergeSchemas([destSchema[key]!, schema as Schema]);
        } else {
          destSchema[key] = schema;
        }
      }
    }
  }
  return dest;
};
