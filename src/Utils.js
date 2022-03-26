import { timeParse } from "d3-time-format";

const Alpaca = require("@alpacahq/alpaca-trade-api");
const parseDate = timeParse("%Y-%m-%dT%H:%M:%SZ");

const API_KEY = "<YOUR-KEY-HERE>";
const API_SECRET = "<YOUR-SECRET-HERE>";

const alpaca = new Alpaca({
  keyId: API_KEY,
  secretKey: API_SECRET,
  paper: false, // Change to true if using a paper account
});

const cbseCoins = { BTCUSD: true, ETHUSD: true, LTCUSD: true, BCHUSD: true };
const cbseOptions = {
  start: new Date(new Date().setDate(new Date().getDate() - 5)),
  end: new Date(),
  timeframe: "1Min",
  exchanges: "CBSE",
};

const ftxuOptions = {
  start: new Date(new Date().setDate(new Date().getDate() - 5)),
  end: new Date(),
  timeframe: "1Min",
  exchanges: "FTXU",
};

const msToMinutes = 1000 * 60;

function createEmptyBar(previousBar) {
  let emptyBar = {
    // Creates a new date object one minute ahead of previous bar
    date: new Date(new Date().setTime(previousBar.date.getTime() + 1000 * 60)),
    open: previousBar.close * 1,
    high: previousBar.close,
    low: previousBar.close,
    close: previousBar.close * 1,
    volume: 0,
  };
  return emptyBar;
}

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

// Fill the empty space in the bars array if they exist
export function fillBars(bars) {
  let filledBars = [bars[0]];
  for (let i = 0; i < bars.length - 1; i++) {
    let currentBar = bars[i];
    let nextBar = bars[i + 1];
    let timeDiff = (nextBar.date - currentBar.date) / msToMinutes;

    let lastBar = currentBar;
    // If the time difference is more than one, fill the space with empty bars
    for (let j = 0; j < timeDiff - 1; j++) {
      let emptyBar = createEmptyBar(lastBar);
      filledBars.push(emptyBar);
      lastBar = emptyBar;
    }
    filledBars.push(nextBar);
  }
  return filledBars;
}

export async function getHistoricalBars(symbol) {
  let options = null;
  if (symbol in cbseCoins === true) {
    options = cbseOptions;
  } else {
    options = ftxuOptions;
  }

  let bars = [];
  let resp = alpaca.getCryptoBars(symbol, options);
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

  let filledBars = fillBars(bars);
  return filledBars;
}
