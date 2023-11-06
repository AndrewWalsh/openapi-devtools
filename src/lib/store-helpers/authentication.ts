import { isEmpty } from "lodash";
import { Leaf } from "../../utils/types";
import { parseHTTPAuthHeader } from "./authentication-http";

export const getAuthType = (auth: string) => {
  const split = auth.split(" ");
  if (!split.length) return "";
  return split[0].toLowerCase();
};

const AUTHORIZATION = "authorization";

type DetermineAuthFromHAR = (harRequest: chrome.devtools.network.Request) => Leaf['authentication'] | undefined;
const determineAuthFromHAR: DetermineAuthFromHAR = (harRequest) => {
  const finalAuth: Leaf['authentication'] = {};
  const foundAuthHeader = harRequest.request.headers.find(
    (head) => head.name.toLowerCase() === AUTHORIZATION
  );
  const authHeaders = foundAuthHeader ? parseHTTPAuthHeader(foundAuthHeader) : undefined;
  if (!isEmpty(authHeaders)) finalAuth[authHeaders.id] = authHeaders;
  if (isEmpty(finalAuth)) return undefined;
  return finalAuth;
};

export default determineAuthFromHAR;
