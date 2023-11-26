import { RadixRouterContext } from "radix3";


// This can be removed when https://github.com/unjs/radix3/pull/73 is fixed
function remove(ctx: RadixRouterContext, path: string) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  
  for (const section of sections) {
    // @ts-expect-error tempfile
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }

  if (node.data) {
    const lastSection = sections[-1];
    node.data = null;
    if (node.children.size === 0) {
      const parentNode = node.parent;
      // @ts-expect-error tempfile
      parentNode.children.delete(lastSection);
      // @ts-expect-error tempfile
      parentNode.wildcardChildNode = null;
      // @ts-expect-error tempfile
      parentNode.placeholderChildNode = null;
    }
    success = true;
  }

  return success;
}

export default remove;
