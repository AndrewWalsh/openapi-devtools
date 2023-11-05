import { MatchedRoute } from "radix3";
import { arrayToPath, getParamName, pathToArray } from "../../utils/helpers";
import { Leaf, LeafMap, PartType, Parts, RouteData } from "../../utils/types";

const paramRe = /:param(\d+)/;
const paramReExact = /^:param(\d+)$/;

export const isParameter = (path: string) => {
  return paramReExact.test(path);
};

export const getParameterisedPath = (
  path: string,
  matchedRoute: MatchedRoute<RouteData>
) => {
  if (!matchedRoute?.params) return path;
  const nextPath = pathToArray(path);
  const paramNames = Object.keys(matchedRoute.params);
  for (const paramName of paramNames) {
    const position = Number(paramName.replace(paramRe, "$1"));
    nextPath[position] = `:${paramName}`;
  }
  return arrayToPath(nextPath);
};

export const getNextPath = (
  index: number,
  path: string,
  matchedRoute: MatchedRoute<RouteData>
) => {
  const pathParamaterised = getParameterisedPath(path, matchedRoute);
  const nextPathArr = pathToArray(pathParamaterised);
  nextPathArr[index] = getParamName(index);
  const nextPath = arrayToPath(nextPathArr);
  return nextPath;
};

export const insertLeafMap = ({
  leafMap,
  leaf,
  host,
  path,
}: {
  leafMap: LeafMap;
  leaf: Leaf;
  host: string;
  path: string;
}) => {
  if (!leafMap[host]) leafMap[host] = {};
  leafMap[host][path] = { data: leaf };
};

const getPartType = (part: string): PartType => {
  const re = /^:param\d+$/;
  return re.test(part) ? PartType.Dynamic : PartType.Static;
};

export const pathToParts = (path: string): Parts => {
  return pathToArray(path).map((part) => ({
    part,
    type: getPartType(part),
  }));
};
