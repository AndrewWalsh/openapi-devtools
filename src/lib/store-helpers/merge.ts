import { Schema, mergeSchemas } from "genson-js";
import type { Leaf } from "../../utils/types";

const mergeAuthentication = (dest: Leaf, src: Leaf): void => {
  if (!src.authentication) return;
  if (!dest.authentication) dest.authentication = {};
  Object.entries(src.authentication).forEach(([key, value]) => {
    dest.authentication![key] = value;
  });
};

export const mergeLeaves = (dest: Leaf, src: Leaf): Leaf => {
  mergeAuthentication(dest, src);
  if (src.mostRecentRequest) dest.mostRecentRequest = src.mostRecentRequest;
  if (src.mostRecentResponse) dest.mostRecentResponse = src.mostRecentResponse;
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
      type Entries = Array<[keyof typeof destSchema, Schema]>;
      for (const [key, schema] of Object.entries(schemaObj) as Entries) {
        if (destSchema[key]) {
          destSchema[key] = mergeSchemas([destSchema[key]!, schema]);
        } else {
          destSchema[key] = schema;
        }
      }
    }
  }
  return dest;
};
