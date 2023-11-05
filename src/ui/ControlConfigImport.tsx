import { useRef, useState, useContext } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Textarea,
  ModalFooter,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import Context from "./context";

function ControlConfigImport() {
  const ctx = useContext(Context);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState("");

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const onImport = () => {
    const result = ctx.import(value);
    if (result) {
      toast({
        title: "Imported.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Could not import.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    onClose();
    return result;
  };

  return (
    <>
      <Tooltip label="Import a state string that was previously exported. This will open a modal, paste in the string to load the state.">
        <Button size="md" onClick={onOpen} colorScheme="teal">
          Import
        </Button>
      </Tooltip>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import state string</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                ref={initialRef}
                placeholder="Paste the state string here..."
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onImport} colorScheme="blue" mr={3}>
              Import
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ControlConfigImport;
