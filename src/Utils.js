import { timeParse } from "d3-time-format";

const Alpaca = require("@alpacahq/alpaca-trade-api");
const parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");
var WebSocketClient = require("websocket").client;

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

// Maybe instead should have this inside dashboard?
// How is this class going to change Dashboard's state?
// class AlpacaWebSocket {
//   constructor(props) {
//     this.symbol = props.symbol;
//   }

//   var client = new WebSocketClient();

//   client.on("connectFailed", (err) => {
//     console.log(err);
//   })
// }

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

// This doesn't need to be async right?
export function getRealtimeBars(symbol, data) {
  const socket = alpaca.crypto_stream_v2;

  socket.onConnect(function () {
    console.log("Connected");
    socket.subscribeForBars([symbol]);
  });

  socket.onError((err) => {
    console.log(err);
  });

  socket.onCryptoBar((bar) => {
    // We should send the parsed bar back to chart. Need to solve problem of
    // multiple bars coming same minute. Is it possible we'd miss a bar?
    console.log(parseBar(bar));
    // data.append(bar)
  });

  socket.onDisconnect(() => {
    console.log("Disconnected");
  });

  socket.connect();
}
