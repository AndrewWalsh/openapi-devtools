import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import copy from "copy-to-clipboard";
import styles from "./controlConfig.module.css";

const QUICKTYPE_URL = "https://app.quicktype.io/";

const generateCodeTooltip = `Paste JSON schemas into ${QUICKTYPE_URL} and convert into client code for 20+ languages, including TypeScript, Java, Rust, and Swift.`;

const ControlConfigActions = () => {
  const toast = useToast();
  const onClickGenerateCode = () => {
    copy(QUICKTYPE_URL);
    toast({
      title: `Copied ${QUICKTYPE_URL} to clipboard. Open it in a new tab.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  return (
    <Menu>
      <MenuButton
        className={styles.actions}
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        Actions
      </MenuButton>
      <MenuList>
        <Tooltip label={generateCodeTooltip}>
          <MenuItem onClick={onClickGenerateCode}>Generate Code</MenuItem>
        </Tooltip>
      </MenuList>
    </Menu>
  );
};

export default ControlConfigActions;
