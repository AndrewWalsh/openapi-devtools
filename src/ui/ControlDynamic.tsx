import { useContext, useMemo, useState } from "react";
import Context from "./context";
import { FixedSizeList as List } from "react-window";
import { Input } from "@chakra-ui/react";
import { Endpoint, PartType } from "../utils/types";
import classes from "./controlDynamic.module.css";
import { Wrap, WrapItem } from "@chakra-ui/react";
import Fuse from "fuse.js";
import AutoSizer from "react-virtualized-auto-sizer";

const getClassnameFromPartType = (type: PartType): string => {
  if (type === PartType.Static) {
    return classes.static;
  }
  return "";
};

const ControlDynamic = () => {
  const { endpoints, parameterise } = useContext(Context);
  const [search, setSearch] = useState("");
  const filteredEndpoints: Endpoint[] = useMemo(() => {
    if (!search) return endpoints;
    const fuseOptions = {
      keys: ["fullPath"],
    };
    const fuse = new Fuse(endpoints, fuseOptions);
    const result = fuse.search(search).map((r) => r.item);
    return result;
  }, [search, endpoints]);
  return (
    <>
      <Input
        placeholder="Search for endpoint..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={classes.search}
      />
      <div className={classes.wrapper}>
        <AutoSizer className={classes.autosizer}>
          {({ height, width }) => (
            <List
              className={classes.autosizerchild}
              height={height}
              itemCount={filteredEndpoints.length}
              itemSize={height / 8}
              width={width}
              itemData={filteredEndpoints}
              itemKey={(index) => filteredEndpoints[index].pathname}
            >
              {({ index, data, style }) => {
                const endpoint = data[index];
                const backgroundColor = index % 2 === 0 ? "#EDF2F7" : undefined;
                const outerKey = endpoint.host + endpoint.pathname;
                return (
                  <div style={style} className={classes.autosizerchild}>
                    <Wrap
                      className={classes.listchild}
                      backgroundColor={backgroundColor}
                      key={outerKey}
                      spacing={0}
                    >
                      {endpoint.parts.map(({ part, type }, parameterisIdx) => {
                        const onClick =
                          type === PartType.Dynamic
                            ? () => {}
                            : () => {
                                parameterise(
                                  parameterisIdx,
                                  endpoint.pathname,
                                  endpoint.host
                                );
                              };
                        const color =
                          type === PartType.Dynamic ? "#319795" : "#3182CE";
                        return (
                          <WrapItem
                            color={color}
                            fontSize="md"
                            className={getClassnameFromPartType(type)}
                            onClick={onClick}
                            key={outerKey + part}
                          >
                            {`/${part}`}
                          </WrapItem>
                        );
                      })}
                    </Wrap>
                  </div>
                );
              }}
            </List>
          )}
        </AutoSizer>
      </div>
    </>
  );
};

export default ControlDynamic;
