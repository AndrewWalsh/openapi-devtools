import { mergeSchemas } from "genson-js";
import type { Leaf } from "../../utils/types";

export const mergeLeaves = (dest: Leaf, src: Leaf): Leaf => {
  dest.pathname = src.pathname;
  dest.authentication = src.authentication || dest.authentication;
  for (const [method, statusCodeObj] of Object.entries(src.methods)) {
    if (!dest.methods[method]) {
      dest.methods[method] = statusCodeObj;
      continue;
    }
    for (const [statusCode, schemaObj] of Object.entries(statusCodeObj)) {
      if (!dest.methods[method][statusCode]) {
        dest.methods[method][statusCode] = schemaObj;
        continue;
      }
      for (const [key, schema] of Object.entries(schemaObj)) {
        const destSchema = dest.methods[method][statusCode];
        type Key = keyof typeof destSchema;
        if (destSchema[key as Key]) {
          destSchema[key as Key] = mergeSchemas([
            destSchema[key as Key]!,
            schema,
          ]);
        } else {
          destSchema[key as Key] = schema;
        }
      }
    }
  }
  return dest;
};
