import React from "react";
import Chart from "./Chart";

class ChartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: props.symbol,
      data: props.data,
    };
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>;
    }
    return <Chart data={this.props.data} />;
  }
}

export default ChartComponent;
