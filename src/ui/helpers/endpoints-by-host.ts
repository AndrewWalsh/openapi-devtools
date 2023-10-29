import { Endpoint } from "../../utils/types";

const compareEndpoints = (e1: Endpoint, e2: Endpoint) => {
  const re = /:param\d+/g;
  const firstPath = e1.pathname.replace(re, "");
  const secondPath = e2.pathname.replace(re, "");
  return firstPath.localeCompare(secondPath);
};

export const sortEndpoints = (endpoints: Array<Endpoint>) => {
  endpoints.sort(compareEndpoints);
  return endpoints;
};
