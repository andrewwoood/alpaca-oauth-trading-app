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

class DataStream {
  constructor({ apiKey, secretKey, feed }) {
    this.alpaca = new Alpaca({
      keyId: apiKey,
      secretKey,
      feed,
    });

    const socket = alpaca.crypto_stream_v2;

    socket.onConnect(function () {
      console.log("Connected");
      socket.subscribeForBars(["BTCUSD"]);
    });

    socket.onError((err) => {
      console.log(err);
    });

    socket.onCryptoTrade((trade) => {
      console.log(trade);
    });

    socket.onCryptoQuote((quote) => {
      console.log(quote);
    });

    socket.onCryptoBar((bar) => {
      // We should send the parsed bar back to chart. Need to solve problem of
      // multiple bars coming same minute. Is it possible we'd miss a bar?
      console.log(parseBar(bar));
    });

    socket.onStateChange((state) => {
      console.log(state);
    });

    socket.onDisconnect(() => {
      console.log("Disconnected");
    });

    socket.connect();
  }
}

// let stream = new DataStream({
//   apiKey: API_KEY,
//   secretKey: API_SECRET,
//   feed: "sip",
// });
