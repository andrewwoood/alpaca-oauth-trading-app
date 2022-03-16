import { timeParse } from "d3-time-format";
import dotenv from "dotenv";

dotenv.config();

const Alpaca = require("@alpacahq/alpaca-trade-api");
const parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET_KEY;

const alpaca = new Alpaca({
  keyId: API_KEY,
  secretKey: API_SECRET,
  paper: true,
});

function parseBar(bar) {
  let parsedBar = {
    date: parseDate(bar.Timestamp),
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
const limit = 10;
var options = {
  start: start,
  end: end,
  timeframe: "1Min",
  // exchanges: "FTXU",
  // limit: limit,
};

getHistoricalBars(symbol, options);
