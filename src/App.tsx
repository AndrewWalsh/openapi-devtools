import { ChakraProvider } from "@chakra-ui/react";
import Main from "./ui/Main";

function App() {
  return (
    <ChakraProvider>
      <Main />
    </ChakraProvider>
  );
}

export default App;
