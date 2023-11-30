import { RadixRouterContext, RadixNode } from "radix3";
import { isParameter } from "./helpers";
import { Leaf, RouteData } from "../../utils/types";

type PathnamesLeaves = Array<{
  pathname: string;
  leaf: Leaf;
}>;

const formatPathname = (parts: Array<string>) => `/${parts.join("/").slice(1)}`;

const recurse = (
  node: RadixNode<RouteData>,
  parts: Array<string>,
  walked: Array<string> = []
): PathnamesLeaves => {
  const pathnames: PathnamesLeaves = [];
  if (!parts.length || !node.children.size) return pathnames;
  const isLast = parts.length === 1;
  const part = parts[0];
  const matchAny = isParameter(part);

  if (isLast) {
    for (const [lastPart, child] of node.children.entries()) {
      if (child.data) {
        const value = {
          pathname: formatPathname([...walked, lastPart]),
          leaf: child.data.data as Leaf,
        };
        pathnames.push(value);
      }
    }
  } else if (matchAny) {
    for (const [part, child] of node.children.entries()) {
      pathnames.push(...recurse(child, parts.slice(1), [...walked, part]));
    }
  } else if (node.children.has(part)) {
    const child = node.children.get(part)!;
    pathnames.push(...recurse(child, parts.slice(1), [...walked, part]));
  }

  return pathnames;
};

const findPathnamesInRouter = (
  routerCtx: RadixRouterContext<RouteData>,
  path: string
): PathnamesLeaves => {
  return recurse(routerCtx.rootNode, path.split("/"));
};

export default findPathnamesInRouter;
