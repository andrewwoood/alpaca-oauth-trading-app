const Alpaca = require("@alpacahq/alpaca-trade-api");
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET_KEY;

const alpaca = new Alpaca({
  keyId: API_KEY,
  secretKey: API_SECRET,
  paper: true,
});

async function getHistoricalBars(symbol, options) {
  let resp = alpaca.getCryptoBars(symbol, options);
  const bars = [];

  for await (let b of resp) {
    console.log(b);
    bars.push(b);
  }
  return bars;
}

// Given this setup, will grab last 10 days of BTC
symbol = "BTCUSD";
var start = new Date();
const end = new Date();
start.setDate(end.getDate() - 10);
options = {
  start: start,
  end: end,
  timeframe: "1Min",
};
