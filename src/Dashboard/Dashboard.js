import React from "react";
import "./Dashboard.scss";
import ChartComponent from "./Chart/ChartComponent";
import Selector from "./Selector/Selector.js";
import { getHistoricalBars, parseRealtimeBar, fillBars } from "../Utils";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      prevSymbol: "BTCUSD",
      symbol: "BTCUSD",
      socket: null,
    };
    this.handleSelection = this.handleSelection.bind(this);
    this.apcaCredentials = {
      action: "auth",
      key: "",
      secret: "",
    };
    this.wsURL =
      "wss://stream.data.alpaca.markets/v1beta1/crypto?exchanges=CBSE,FTXU";
  }

  handleSelection = async (symbol) => {
    console.log(`Changing symbol to ${symbol}`);

    const data = await getHistoricalBars(symbol);
    this.setState({ data: data });
    this.setState({ symbol: symbol });
    this.getNewRealtimeBars();
  };

  getNewRealtimeBars = () => {
    let unSubscribeObject = {
      action: "unsubscribe",
      bars: [this.state.prevSymbol],
    };
    let subscribeObject = {
      action: "subscribe",
      bars: [this.state.symbol],
    };
    this.state.socket.send(JSON.stringify(unSubscribeObject));
    this.state.socket.send(JSON.stringify(subscribeObject));
    this.setState({ prevSymbol: this.state.symbol });
  };

  handleChange = (e) => {
    this.setState({ symbol: e.target.value });
  };

  // On pressing submit, need to replace data with new crypto bars
  handleSubmit = async (e) => {
    e.preventDefault();

    const data = await getHistoricalBars(this.state.symbol);
    this.setState({ data: data });
    this.getNewRealtimeBars();
  };

  initializeSocket = () => {
    let subscribeObject = {
      action: "subscribe",
      bars: [this.state.symbol],
    };
    const socket = new WebSocket(this.wsURL);

    socket.onmessage = (msg) => {
      console.log(msg);
      const { data } = msg;
      let parsedMsg = JSON.parse(data)[0];
      // Only parse messages that are bars.
      if (parsedMsg["T"] === "b") {
        let parsedBar = parseRealtimeBar(parsedMsg);
        let mostRecentBar = this.state.data[this.state.data.length - 1];
        console.log(mostRecentBar);
        console.log(parsedBar);
        const msToMinutes = 1000 * 60;
        let timeDiff = (parsedBar.date - mostRecentBar.date) / msToMinutes;
        console.log(timeDiff);
        if (parsedBar.date <= mostRecentBar.date) {
          // If this bar is a repeat then don't append it to our chart
          return;
        } else if (timeDiff > 1) {
          // If there will be a gap in the data, fill the space with an empty bar
          let unfilledBars = [mostRecentBar, parsedBar];
          let datesToAppend = fillBars(unfilledBars);
          this.setState({
            data: [...this.state.data, ...datesToAppend],
          });
          return;
        }
        // The case where we receive the correct bar at the correct time
        this.setState({
          data: [...this.state.data, parsedBar],
        });
      }
    };
    // Once connection is established, authenticate
    socket.onopen = (evt) => {
      this.setState({ socket: socket });
      socket.send(JSON.stringify(this.apcaCredentials));
      socket.send(JSON.stringify(subscribeObject));
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
    console.log("Render inside dashboard");
    return (
      <div className="dashboard-container">
        <div className="chart">
          <label className="chart-symbol">
            Current Symbol: <b> {this.state.symbol} </b>{" "}
          </label>
          <ChartComponent symbol={this.state.symbol} data={this.state.data} />
        </div>

        <Selector handler={this.handleSelection} />
        <div className="form">
          <form onSubmit={this.handleSubmit}>
            <label>
              Symbol:
              <input type="text" onChange={this.handleChange} />
            </label>
            <input type="submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default Dashboard;
