import { createRouter } from "radix3";
import { LeafMap, RouterMap, RouteData } from "../../utils/types";

const leafMapToStore = (leafMap: LeafMap): RouterMap => {
  const routerMap: RouterMap = {};
  Object.entries(leafMap).forEach(([host, routeData]) => {
    const router = createRouter<RouteData>({
      routes: routeData,
    });
    routerMap[host] = router;
  });
  return routerMap;
};

export default leafMapToStore;
