import { RadixNode } from "radix3";
import { isParameter } from "./helpers";
import { RouteData } from "../../utils/types";

/**
 * When you remove an item in radix3, it only removes the data
 * We need to remove the node itself so that lookups won't match with it
 */
const pruneRouter = (
  node: RadixNode<RouteData>,
  parts: Array<string>
): void => {
  if (!parts.length || !node.children.size) return;
  const isLast = parts.length === 1;
  const part = parts[0];
  const matchAny = isParameter(part);
  if (!matchAny && !node.children.has(part)) return;
  if (!isLast) {
    if (matchAny) {
      for (const child of node.children.values()) {
        pruneRouter(child, parts.slice(1));
      }
    } else if (node.children.has(part)) {
      const child = node.children.get(part)!;
      if (child) {
        pruneRouter(child, parts.slice(1));
      }
    }
  }

  const noChildren = node.children.get(part)?.children.size === 0;
  const noData =  !node.children.get(part)?.data;
  if (noChildren && noData) {
    node.children.delete(part);
  }
};

const pruneRouterWrapper: typeof pruneRouter = (node, parts) => {
  pruneRouter(node, ["", ...parts]);
};

export default pruneRouterWrapper;
