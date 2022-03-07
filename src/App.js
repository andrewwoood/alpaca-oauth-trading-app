import Home from "./Home";

import React, { Component } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
