import React from "react";
import "./Dashboard.scss";
import Chart from "./Chart/Chart.js";
import Selector from "./Selector/Selector.js";
import { getHistoricalBars, parseRealtimeBar, fillBars } from "../Utils";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      prevSymbol: "BTCUSD",
      symbol: "BTCUSD",
    };
    this.socket = null;
    this.handleSelection = this.handleSelection.bind(this);
    this.apcaCredentials = {
      action: "auth",
      key: "<YOUR-KEY-HERE>",
      secret: "<YOUR-SECRET-HERE>",
    };
    this.wsURL =
      "wss://stream.data.alpaca.markets/v1beta1/crypto?exchanges=CBSE,FTXU";
  }

  handleSelection = async (symbol) => {
    const data = await getHistoricalBars(symbol);
    this.setState({ data: data });
    this.setState({ symbol: symbol });
    this.getNewRealtimeBars();
  };

  getNewRealtimeBars = () => {
    const unSubscribeObject = {
      action: "unsubscribe",
      bars: [this.state.prevSymbol],
    };
    const subscribeObject = {
      action: "subscribe",
      bars: [this.state.symbol],
    };
    this.socket.send(JSON.stringify(unSubscribeObject));
    this.socket.send(JSON.stringify(subscribeObject));
    this.setState({ prevSymbol: this.state.symbol });
  };

  appendNewBar = (parsedMsg) => {
    let parsedBar = parseRealtimeBar(parsedMsg);
    let mostRecentBar = this.state.data[this.state.data.length - 1];
    const msToMinutes = 1000 * 60;
    const timeDiff = (parsedBar.date - mostRecentBar.date) / msToMinutes;
    if (parsedBar.date <= mostRecentBar.date) {
      // If this bar is a repeat then don't append it to our chart
      return;
    } else if (timeDiff > 1) {
      // If there will be a gap in the data, fill the space with an empty bar
      let unfilledBars = [mostRecentBar, parsedBar];
      let filledBars = fillBars(unfilledBars);
      this.setState({
        data: [...this.state.data, ...filledBars],
      });
      return;
    } else {
      // If we received the correct bar, insert it directly and update
      this.setState({
        data: [...this.state.data, parsedBar],
      });
    }
  };

  initializeSocket = () => {
    const subscribeObject = {
      action: "subscribe",
      bars: [this.state.symbol],
    };
    const socket = new WebSocket(this.wsURL);

    socket.onmessage = (msg) => {
      const { data } = msg;
      let parsedMsg = JSON.parse(data)[0];
      // Looking specifically for messages that are bars
      if (parsedMsg["T"] === "b") {
        this.appendNewBar(parsedMsg);
      }
    };

    // Once connection is open, authenticate then subscribe to symbol's bars
    socket.onopen = () => {
      this.socket = socket;
      this.socket.send(JSON.stringify(this.apcaCredentials));
      this.socket.send(JSON.stringify(subscribeObject));
    };
  };

  componentDidMount() {
    getHistoricalBars(this.state.symbol)
      .then((data) => {
        this.setState({ data: data });
      })
      .then(() => {
        this.initializeSocket();
      });
  }

  render() {
    if (this.state.data == null) {
      return <div>Loading...</div>;
    }
    return (
      <div className="dashboard-container">
        <div className="selector">
          <Selector handler={this.handleSelection} />
        </div>
        <div className="chart">
          <label className="chart-symbol">
            Current Symbol: <b> {this.state.symbol} </b>{" "}
          </label>
          <Chart data={this.state.data} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
