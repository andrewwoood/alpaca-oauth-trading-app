import React from "react";
import "./Dashboard.scss";
import ChartComponent from "./Chart/ChartComponent";
import { getHistoricalBars, parseRealtimeBar } from "../Utils";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      symbol: "BTCUSD",
      options: {
        start: new Date(new Date().setDate(new Date().getDate() - 5)),
        end: new Date(),
        timeframe: "1Min",
        exchanges: "CBSE",
      },
      socket: null,
      apcaCredentials: {
        action: "auth",
        key: "",
        secret: "",
      },
    };
  }

  // Implement this after
  getRealtimeBars = () => {
    let URL = "wss://stream.data.alpaca.markets/v1beta1/crypto?exchanges=CBSE";
    this.state.socket = new WebSocket(URL);
  };

  handleChange = (e) => {
    this.setState({ symbol: e.target.value });
  };

  // On pressing submit, need to replace data with new crypto bars
  handleSubmit = async (e) => {
    e.preventDefault();

    const data = await getHistoricalBars(this.state.symbol, this.state.options);

    console.log("State data is:");
    console.log(data);
    this.setState({ data: data });
    console.log(this.state.data);

    let unSubscribeObject = {
      action: "unsubscribe",
      bars: ["*"],
    };
    let subscribeObject = {
      action: "subscribe",
      bars: [this.state.symbol],
    };
    this.state.socket.send(JSON.stringify(unSubscribeObject));
    // this.state.socket.send(JSON.stringify(subscribeObject));
    // });
  };

  componentDidMount() {
    getHistoricalBars(this.state.symbol, this.state.options)
      .then((data) => {
        this.setState({ data: data });
      })
      .then(async () => {
        let apcaCredentials = {
          action: "auth",
          key: "",
          secret: "",
        };
        let subscribeObject = {
          action: "subscribe",
          bars: [this.state.symbol],
        };
        // Make socket connection?
        let URL =
          "wss://stream.data.alpaca.markets/v1beta1/crypto?exchanges=CBSE";
        const socket = new WebSocket(URL);

        socket.onmessage = (msg) => {
          console.log(msg);
          const { data } = msg;
          let parsedMsg = JSON.parse(data)[0];
          console.log(parsedMsg);
          // I should only parse messages that are bars.
          if (parsedMsg["T"] == "b") {
            let parsedBar = parseRealtimeBar(parsedMsg);
            console.log(parsedBar);
            this.setState({
              data: [...this.state.data, parsedBar],
            });
          }
        };
        socket.onopen = (evt) => {
          this.setState({ socket: socket });
          console.log(this.state.socket);
          console.log(evt);
          socket.send(JSON.stringify(apcaCredentials));
          socket.send(JSON.stringify(subscribeObject));
        };
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
