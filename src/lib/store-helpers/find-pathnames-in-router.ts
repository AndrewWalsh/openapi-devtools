import { RadixRouterContext, RadixNode } from "radix3";
import { isParameter } from "./helpers";
import { Leaf, RouteData } from "../../utils/types";

type PathnamesLeaves = Array<{
  pathname: string;
  leaf: Leaf;
}>;

const formatPathname = (parts: Array<string>) => `/${parts.join("/").slice(1)}`;

/**
 * Walk the tree. Return string[][], each element of which is path
 * E.g. [["api", "v1", "user"], ["api", "v1", "user"]]
 */
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

  if (matchAny) {
    // If this part is a wildcard, match any
    // If it's also the last part, include leaf children
    // Otherwise, recurse on all children
    if (isLast) {
      for (const [part, child] of node.children.entries()) {
        if (!child.children.size) {
          const value = {
            pathname: formatPathname([...walked, part]),
            leaf: child.data!.data as Leaf,
          };
          pathnames.push(value);
        }
      }
    } else {
      for (const [lastPart, child] of node.children.entries()) {
        pathnames.push(
          ...recurse(child, parts.slice(1), [...walked, lastPart])
        );
      }
    }
  } else if (node.children.has(part)) {
    // If this part is static, match it
    // If it's also the last part, include leaf child
    // Otherwise, recurse on child
    const child = node.children.get(part)!;
    if (isLast) {
      const value = {
        pathname: formatPathname([...walked, part]),
        leaf: child.data!.data as Leaf,
      };
      pathnames.push(value);
    } else {
      if (child) {
        pathnames.push(...recurse(child, parts.slice(1), [...walked, part]));
      }
    }
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
