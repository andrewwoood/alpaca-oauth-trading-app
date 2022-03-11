import { tsvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Next 3 declarations are for old data
const parseDate = timeParse("%Y-%m-%d");

export function getData() {
  const promiseMSFT = fetch(
    "https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv"
  )
    .then((response) => response.text())
    .then((data) => tsvParse(data, parseData(parseDate)));
  return promiseMSFT;
}

function parseData(parse) {
  return function (d) {
    d.date = parse(d.date);
    d.open = +d.open;
    d.high = +d.high;
    d.low = +d.low;
    d.close = +d.close;
    d.volume = +d.volume;

    return d;
  };
}

const Alpaca = require("@alpacahq/alpaca-trade-api");
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET_KEY;

export function getData(symbol) {
  const alpaca = new Alpaca({
    keyId: API_KEY,
    secretKey: API_SECRET,
    paper: false,
  });
  // await bars = alpaca.getBars(symbol, )
}

const Utils = {
  async getAuthToken(oauth_code) {
    // returns Authorization Token once we have our OAuth token
    const body = {
      grant_type: "authorization_code",
      code: oauth_code,
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    };

    // encode data into form encoding
    const encodedBody = Object.keys(body)
      .map((key) => `${key}=${encodeURIComponent(body[key])}`)
      .join("&");
    console.log(body);
    // submit POST request
    const response = await axios({
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      url: "https://api.alpaca.markets/oauth/token",
      data: encodedBody,
    });

    const { data } = response;
    return data.access_token;
  },

  parseResponse(response) {
    const { bars } = response.data;
    const data = [];
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const point = {
        date: bar.t,
        open: bar.o,
        low: bar.l,
        high: bar.h,
        close: bar.c,
        volume: bar.v,
      };
      data.push(point);
    }
    return data;
  },
};

class DataStream {
  constructor({ apiKey, secretKey, feed }) {
    this.alpaca = new Alpaca({
      keyId: apiKey,
      secretKey,
      feed,
    });

    const socket = this.alpaca.data_stream_v2;

    socket.onConnect(function () {
      console.log("Connected");
      socket.subscribeForQuotes(["AAPL"]);
      socket.subscribeForTrades(["FB"]);
      socket.subscribeForBars(["SPY"]);
      socket.subscribeForStatuses(["*"]);
    });

    socket.onError((err) => {
      console.log(err);
    });

    socket.onStockTrade((trade) => {
      console.log(trade);
    });

    socket.onStockQuote((quote) => {
      console.log(quote);
    });

    socket.onStockBar((bar) => {
      console.log(bar);
    });

    socket.onStatuses((s) => {
      console.log(s);
    });

    socket.onStateChange((state) => {
      console.log(state);
    });

    socket.onDisconnect(() => {
      console.log("Disconnected");
    });

    socket.connect();

    // unsubscribe from FB after a second
    setTimeout(() => {
      socket.unsubscribeFromTrades(["FB"]);
    }, 1000);
  }
}

// let stream = new DataStream({
//   apiKey: API_KEY,
//   secretKey: API_SECRET,
//   feed: "IEX",
//   paper: true,
// });
export default Utils;
