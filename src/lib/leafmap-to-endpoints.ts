import { Endpoint, LeafMap } from "../utils/types";
import { pathToParts } from "./store-helpers/helpers";

const leafMapToEndpoints = (leafMap: LeafMap): Array<Endpoint> => {
  const endpoints: Array<Endpoint> = [];
  for (const [host, pathData] of Object.entries(leafMap)) {
    for (const [path, leaf] of Object.entries(pathData)) {
      const endpoint: Endpoint = {
        host,
        parts: pathToParts(path),
        pathname: path,
        data: leaf.data,
      };
      endpoints.push(endpoint);
    }
  }
  return endpoints;
};

export default leafMapToEndpoints;
