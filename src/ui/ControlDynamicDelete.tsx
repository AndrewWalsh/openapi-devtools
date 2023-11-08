import { FC } from "react";
import { CloseButton } from "@chakra-ui/react";
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

import styles from "./controlDynamicDelete.module.css";

const outline = defineStyle({
  border: "2px dashed",
  borderRadius: 0,
  fontWeight: "semibold",
});

export const closeButtonTheme = defineStyleConfig({
  variants: { outline },
});


type Props = {
  onClick: () => void;
};

const ControlDynamicDelete: FC<Props> = ({ onClick }) => {
  return (
    <div className={styles.container}>
      <CloseButton onClick={onClick} />
    </div>
  );
};

export default ControlDynamicDelete;
