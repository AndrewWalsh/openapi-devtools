import { useState, useContext } from "react";
import { Tooltip, HStack, FormControl, FormLabel } from "@chakra-ui/react";
import { Switch } from "@chakra-ui/react";
import ControlConfigImport from "./ControlConfigImportExport";
import Context from "./context";

const TOGGLEMOREID = "toggle-more-info";

const ControlConfig = () => {
  const ctx = useContext(Context);
  const [moreInfoEnabled, setMoreInfoEnabled] = useState(
    ctx.options().enableMoreInfo
  );
  const onToggleMoreInfo = () => {
    const enableMoreInfo = !ctx.options().enableMoreInfo;
    ctx.options({ enableMoreInfo });
    setMoreInfoEnabled(enableMoreInfo);
  };
  return (
    <HStack justifyContent="space-between">
      <FormControl display="flex" alignItems="center">
        <Tooltip label="Include the most recent request and response as examples in the specification. This could include private information. Your choice will persist across sessions.">
          <FormLabel htmlFor={TOGGLEMOREID} mb="0">
            More info
          </FormLabel>
        </Tooltip>
        <Switch
          id={TOGGLEMOREID}
          onChange={onToggleMoreInfo}
          isChecked={moreInfoEnabled}
        />
      </FormControl>
      <HStack>
        <ControlConfigImport />
      </HStack>
    </HStack>
  );
};

export default ControlConfig;
