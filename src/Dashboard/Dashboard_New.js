import React from "react";
import "./Dashboard.scss";
import ChartComponent from "./Chart/ChartComponent";
import { getHistoricalBars } from "../Utils";

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
    };
  }

  getRealtimeBars = () => {
    let URL = "wss://stream.data.alpaca.markets/v1beta1/crypto";
    this.state.socket = new WebSocket(URL);
  };

  handleChange = (e) => {
    this.setState({ symbol: e.target.value });
  };

  // On pressing submit, need to replace data with new crypto bars
  handleSubmit = async (e) => {
    e.preventDefault();

    getHistoricalBars(this.state.symbol, this.state.options).then((data) => {
      // console.log(`Querying for ${this.state.symbol} and changing data to:`);
      // console.log(data);

      console.log("State data is:");
      this.setState({ data: data });
      console.log(this.state.data);
      // I'll need to create a new websocket as well
    });
  };

  componentDidMount() {
    getHistoricalBars(this.state.symbol, this.state.options)
      .then((data) => {
        this.setState({ data: data });
      })
      .then(() => {
        // Make socket connection?
        let URL = "wss://stream.data.alpaca.markets/v1beta1/crypto";
        // this.state.socket = new WebSocket(URL);
        const socket = new WebSocket(URL);
        socket.onopen = function (evt) {
          console.log(evt);
        };
        console.log(socket);
        // socket.on("message", (stream) => {
        // console.log(stream);
        // });
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
