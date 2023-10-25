import { IconButton, Tooltip } from "@chakra-ui/react";
import {
  ViewIcon,
  ViewOffIcon,
  DeleteIcon,
  SettingsIcon,
} from "@chakra-ui/icons";

type VoidFn = () => void;
export const StartBtn = ({ onClick }: { onClick: VoidFn }) => (
  <Tooltip label="Start recording" placement="top">
    <IconButton
      aria-label="Start recording"
      onClick={onClick}
      icon={<ViewIcon />}
      colorScheme="teal"
    />
  </Tooltip>
);

export const StopBtn = ({ onClick }: { onClick: VoidFn }) => (
  <Tooltip label="Stop recording" placement="top">
    <IconButton
      aria-label="Stop recording"
      onClick={onClick}
      icon={<ViewOffIcon />}
      colorScheme="blue"
    />
  </Tooltip>
);

export const SettingsBtn = ({ onClick }: { onClick: VoidFn }) => (
  <Tooltip label="Configure dynamic paths and filter hosts" placement="top">
    <IconButton
      aria-label="Configure dynamic paths and filter hosts"
      onClick={onClick}
      icon={<SettingsIcon />}
      colorScheme="gray"
    />
  </Tooltip>
);

export const ClearBtn = ({ onClick }: { onClick: VoidFn }) => (
  <Tooltip label="Clear data and start again" placement="top">
    <IconButton
      aria-label="Clear data and start again"
      onClick={onClick}
      icon={<DeleteIcon />}
      colorScheme="red"
    />
  </Tooltip>
);
