const Alpaca = require("@alpacahq/alpaca-trade-api");
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET_KEY;

const alpaca = new Alpaca({
  keyId: API_KEY,
  secretKey: API_SECRET,
  paper: true,
});

class DataStream {
  constructor({ apiKey, secretKey, feed }) {
    this.alpaca = new Alpaca({
      keyId: apiKey,
      secretKey,
      feed,
    });

    // const socket = alpaca.data_stream_v2;
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
      console.log(bar);
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

let stream = new DataStream({
  apiKey: API_KEY,
  secretKey: API_SECRET,
  feed: "sip",
  // paper: true, // This is not necessary right?
});
