import { timeParse } from "d3-time-format";

const Alpaca = require("@alpacahq/alpaca-trade-api");
const parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");

// REMOVE BEFORE PUSHING
const API_KEY = "";
const API_SECRET = "";

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

export function parseRealtimeBar(bar) {
  let parsedBar = {
    date: parseDate(bar.t),
    open: bar.o,
    high: bar.h,
    low: bar.l,
    close: bar.c,
    volume: bar.v,
  };
  return parsedBar;
}

export async function getHistoricalBars(symbol, options) {
  // console.log(`Querying bars for ${symbol}`);
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
  // console.log(bars);
  return bars;
}
