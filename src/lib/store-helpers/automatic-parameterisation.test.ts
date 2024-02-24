import { it, expect } from "vitest";
import { fastPathParameterIndices } from "./automatic-parameterisation";

// [what is being tested, pathname, indices that should be parameterised]
it.each([["UUIDs", "/path/7be85ff3-2785-45d4-81d0-b8b58f80dfdc", [1]]])(
  "returns indices of path parameters that are %s in pathnames",
  (_, path, expected) => {
    const result = fastPathParameterIndices(path);
    expect(result).toEqual(expected);
  }
);
