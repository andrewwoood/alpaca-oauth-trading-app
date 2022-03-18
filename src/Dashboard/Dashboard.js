import React from "react";
import "./Dashboard.scss";
import ChartComponent from "./Chart/ChartComponent";
import { getHistoricalBars, parseRealtimeBar } from "../Utils";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      prevSymbol: "BTCUSD",
      symbol: "BTCUSD",
      options: {
        start: new Date(new Date().setDate(new Date().getDate() - 5)),
        end: new Date(),
        timeframe: "1Min",
        exchanges: "CBSE",
      },
      socket: null,
    };
    this.apcaCredentials = {
      action: "auth",
      key: "",
      secret: "",
    };
    this.cbseURL =
      "wss://stream.data.alpaca.markets/v1beta1/crypto?exchanges=CBSE";
    this.ftxURL =
      "wss://stream.data.alpaca.markets/v1beta1/crypto?exchanges=FTXU";
  }

  // Implement this after
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

    const data = await getHistoricalBars(this.state.symbol, this.state.options);
    this.setState({ data: data });

    this.getNewRealtimeBars();
  };

  initializeSocket = () => {
    let subscribeObject = {
      action: "subscribe",
      bars: [this.state.symbol],
    };
    const socket = new WebSocket(this.cbseURL);

    socket.onmessage = (msg) => {
      console.log(msg);
      const { data } = msg;
      let parsedMsg = JSON.parse(data)[0];
      // Only parse messages that are bars.
      if (String(parsedMsg["T"]) === "b") {
        let parsedBar = parseRealtimeBar(parsedMsg);
        console.log(parsedBar);
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
    getHistoricalBars(this.state.symbol, this.state.options)
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
