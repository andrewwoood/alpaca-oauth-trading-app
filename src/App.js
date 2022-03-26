import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
