import { unset } from "lodash";
import { pathToArray } from "../../utils/helpers";
import { Leaf, RouterMap } from "../../utils/types";
import { mergeLeaves } from "./merge";
import { getNextPath } from "./helpers";
import findPathnamesInRouter from "./find-pathnames-in-router";
import { pruneRouter } from ".";

type Params = {
  store: RouterMap;
  host: string;
  path: string;
  index: number;
};

type Returns = {
  removedPaths: Array<string>;
  insertedPath: string;
  insertedLeaf: Leaf;
};

export default function parameterise({
  store,
  index,
  path,
  host,
}: Params): Returns | null {
  const removedPaths: Array<string> = [];
  const matchedLeaves: Array<Leaf> = [];
  const router = store[host];
  if (!router) return null;
  const matchedRoute = router.lookup(path);
  if (!matchedRoute) return null;
  const nextPath = getNextPath(index, path, matchedRoute);
  for (const found of findPathnamesInRouter(router.ctx, nextPath)) {
    matchedLeaves.push(found.leaf);
    removedPaths.push(found.pathname);
    pruneRouter(router.ctx.rootNode, pathToArray(found.pathname));
  }
  const mergedLeaf = matchedLeaves.reduce(mergeLeaves);
  mergedLeaf.pathname = nextPath;
  router.insert(nextPath, { data: mergedLeaf });
  removedPaths.forEach((path) => unset(store[host].ctx.staticRoutesMap, path));
  return {
    removedPaths,
    insertedPath: nextPath,
    insertedLeaf: mergedLeaf,
  };
}
