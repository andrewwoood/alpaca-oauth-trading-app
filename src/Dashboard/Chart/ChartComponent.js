import React from "react";
import { render } from "react-dom";
import Chart from "./Chart_New";
import { TypeChooser } from "react-stockcharts/lib/helper";
import { timeParse } from "d3-time-format";
import { getHistoricalBars } from "../../Utils";

class ChartComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log("Constructor with properties:");
    console.log(props);
    this.state = {
      symbol: props.symbol,
      data: props.data,
    };
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>;
    }
    return (
      <TypeChooser>
        {(type) => <Chart type={type} data={this.state.data} />}
        {/* {(type) => <Chart type={type} data={this.data} />} */}
      </TypeChooser>
    );
  }
}

export default ChartComponent;
