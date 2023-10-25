import { groupBy } from "lodash";
import { EndpointsByHost, Endpoint } from "../../utils/types";

const compareEndpoints = (e1: Endpoint, e2: Endpoint) => {
  const re = /:param\d+/g;
  const firstPath = e1.fullPath.replace(re, "");
  const secondPath = e2.fullPath.replace(re, "");
  return firstPath.localeCompare(secondPath);
};

const groupByHost = (endpoints: Endpoint[]): EndpointsByHost => {
  const grouped = groupBy(endpoints, "host");
  return Object.entries(grouped).map(([host, endpoints]) => ({
    host,
    endpoints,
  }));
};

export const sortEndpoints = (endpoints: Array<Endpoint>) => {
  endpoints.sort(compareEndpoints);
  return endpoints;
};

const endpointsByHost = (endpoints: Array<Endpoint>) => {
  sortEndpoints(endpoints);
  const grouped = groupByHost(endpoints);
  grouped.sort((a, b) => a.host.localeCompare(b.host));
  return grouped;
};

export default endpointsByHost;
