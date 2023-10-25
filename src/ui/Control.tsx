import { FC, useState } from "react";
import classes from "./control.module.css";
import { Status } from "../utils/types";
import { StartBtn, StopBtn, SettingsBtn, ClearBtn } from "./ControlButtons";
import ControlDrawer from "./ControlDrawer";

type VoidFn = () => void;
type Props = {
  start: VoidFn;
  stop: VoidFn;
  clear: VoidFn;
  status: Status;
};

const Control: FC<Props> = ({ start, stop, clear, status }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className={classes.wrapper}>
        {status === Status.STOPPED ? (
          <StartBtn onClick={start} />
        ) : (
          <StopBtn onClick={stop} />
        )}
        <SettingsBtn onClick={() => setIsOpen(true)} />
        <ClearBtn onClick={clear} />
      </div>
      <ControlDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Control;
