import { ChakraProvider } from "@chakra-ui/react";
import Main from "./ui/Main";
import { closeButtonTheme } from "./ui/ControlDynamicDelete";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: { CloseButton: closeButtonTheme },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Main />
    </ChakraProvider>
  );
}

export default App;
