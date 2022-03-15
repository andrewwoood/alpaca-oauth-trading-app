// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

import React from "react";
import { render } from "react-dom";
import Chart from "./Dashboard/Chart/Chart_New";
import { getData } from "./Utils";
import { TypeChooser } from "react-stockcharts/lib/helper";
import { timeParse, utcParse } from "d3-time-format";

// console.log(dotenv.config());

const Alpaca = require("@alpacahq/alpaca-trade-api");
const parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");

// const API_KEY = process.env.API_KEY;
// const API_SECRET = process.env.API_SECRET_KEY;

// REMOVE THIS BEFORE COMMITTING
const API_KEY = "";
const API_SECRET = "";

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
    date: parseDate(bar.Timestamp),
    // date: bar.Timestamp,
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
    bars.push(parsedBar);
  }

  bars.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    } else if (a.date < b.date) {
      return -1;
    } else {
      return 0;
    }
  });

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
  // exchanges: "FTXU",
  // limit: 100, // Limit throws an error after returning all bars
};

// Alpaca Implementation
class ChartComponent extends React.Component {
  componentDidMount() {
    getHistoricalBars(symbol, options).then((data) => {
      this.setState({ data });
    });
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>;
    }
    return (
      <TypeChooser>
        {(type) => <Chart type={type} data={this.state.data} />}
      </TypeChooser>
    );
  }
}

// Example implementation
// class ChartComponent extends React.Component {
//   componentDidMount() {
//     getData().then((data) => {
//       this.setState({ data });
//     });
//   }
//   render() {
//     if (this.state == null) {
//       return <div>Loading...</div>;
//     }
//     return (
//       <TypeChooser>
//         {(type) => <Chart type={type} data={this.state.data} />}
//       </TypeChooser>
//     );
//   }
// }

render(<ChartComponent />, document.getElementById("root"));
