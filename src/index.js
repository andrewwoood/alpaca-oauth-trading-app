import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// Get symbol from selector later
// render(<ChartComponent symbol="BTCUSD" />, document.getElementById("root"));
