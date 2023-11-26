import { unset } from "lodash";
import { pathToArray } from "../../utils/helpers";
import { Leaf, RouterMap } from "../../utils/types";
import { remove, pruneRouter, findPathnamesInRouter, mergeLeaves, getNextPath } from ".";

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
  const foundPathnames = findPathnamesInRouter(router.ctx, nextPath);
  for (const found of foundPathnames) {
    matchedLeaves.push(found.leaf);
    removedPaths.push(found.pathname);
    remove(router.ctx, found.pathname);
    pruneRouter(router.ctx.rootNode, pathToArray(found.pathname));
  }
  const mergedLeaf = matchedLeaves.reduce(mergeLeaves);
  mergedLeaf.pathname = nextPath;
  removedPaths.forEach((path) => unset(store[host].ctx.staticRoutesMap, path));
  unset(store[host].ctx.staticRoutesMap, nextPath);
  router.insert(nextPath, { data: mergedLeaf });
  return {
    removedPaths,
    insertedPath: nextPath,
    insertedLeaf: mergedLeaf,
  };
}
