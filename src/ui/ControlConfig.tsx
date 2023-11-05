import { useContext } from "react";
import { Button, Tooltip, HStack, useToast } from "@chakra-ui/react";
import copy from 'copy-to-clipboard';
import Context from './context';
import ControlConfigImport from './ControlConfigImport';

const ControlConfig = () => {
  const ctx = useContext(Context);
  const toast = useToast();
  const onExport = () => {
    const stateStr = ctx.export();
    copy(stateStr);
    toast({
      title: "Copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  return (
    <HStack>
      <ControlConfigImport />
      <Tooltip label="Export will copy a state string to your clipboard. Save this somewhere on your computer. You can load it by clicking import and pasting the string.">
        <Button size="md" onClick={onExport} colorScheme="teal">
          Export
        </Button>
      </Tooltip>
    </HStack>
  );
};

export default ControlConfig;
