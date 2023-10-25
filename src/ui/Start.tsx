import { FC, useState } from "react";
import { Button } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import classes from "./start.module.css";

type Props = {
  start: () => void;
};

const Start: FC<Props> = ({ start }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    if (!isLoading) start();
    setIsLoading(true);
  };

  return (
    <div className={classes.wrapper}>
      <Button
        leftIcon={<ViewIcon />}
        isLoading={isLoading}
        loadingText="Waiting for first request..."
        onClick={onClick}
        disabled={isLoading}
        colorScheme="teal"
      >
        Start Recording
      </Button>
    </div>
  );
};

export default Start;
