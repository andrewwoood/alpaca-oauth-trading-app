// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

import dotenv from "dotenv";
import React from "react";
import { render } from "react-dom";
import Chart from "./Dashboard/Chart/Chart_New";
import { getData } from "./Utils";
import { TypeChooser } from "react-stockcharts/lib/helper";

dotenv.config({ path: "../.env" });

const Alpaca = require("@alpacahq/alpaca-trade-api");

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET_KEY;

console.log(process.env.API_KEY);

console.log(API_KEY);
console.log(API_SECRET);

const alpaca = new Alpaca({
  keyId: API_KEY,
  secretKey: API_SECRET,
  paper: true,
});

function parseBar(bar) {
  let parsedBar = {
    date: bar.Timestamp,
    open: bar.Open,
    high: bar.High,
    low: bar.Low,
    close: bar.Close,
    volume: bar.Volume,
  };
  return parsedBar;
}

async function getHistoricalBars(symbol, options) {
  let resp = alpaca.getCryptoBars(symbol, options);
  const bars = [];

  for await (let bar of resp) {
    let parsedBar = parseBar(bar);
    console.log(parsedBar);
    bars.push(parsedBar);
  }
  return bars;
}

// Given this setup, will grab last 5 days of BTC. There are 1440 bars/day.
const symbol = "BTCUSD";
var start = new Date();
const end = new Date();
start.setDate(end.getDate() - 5);
var options = {
  start: start,
  end: end,
  timeframe: "1Min",
};

class ChartComponent extends React.Component {
  state = {
    apcaData: getHistoricalBars(symbol, options),
  };
  componentDidMount() {
    getData().then((data) => {
      this.setState({ data });
    });
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>;
    }
    return (
      <TypeChooser>
        {(type) => <Chart type={type} data={this.state.apcaData} />}
      </TypeChooser>
    );
  }
}

render(<ChartComponent />, document.getElementById("root"));
// export default ChartComponent;
