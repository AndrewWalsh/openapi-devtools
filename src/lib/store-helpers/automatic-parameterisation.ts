import validator from "validator";

const validationRules = [validator.isUUID];

/**
 * Fast and low-effort rules-based parameterisation of pathnames alone
 * Designed to accompany a more computationally intensive analysis
 * Returns an array of indices of path parameters in a given pathname that matches a validation rule
 */
export const fastPathParameterIndices = (pathname: string): Array<number> => {
  const indices = [];
  const parts = pathname.split("/").slice(1);
  for (let idx = 0; idx < parts.length; idx++) {
    const part = parts[idx];
    if (validationRules.some((rule) => rule(part))) {
      indices.push(idx);
    }
  }
  return indices;
};
