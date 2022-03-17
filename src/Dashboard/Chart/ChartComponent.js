import React from "react";
import Chart from "./Chart_New";
import { TypeChooser } from "react-stockcharts/lib/helper";

class ChartComponent extends React.Component {
  // I think the issue with this not updating is that the
  // constructor is only run at the beginning, and won't run again
  // after receiving new data.
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
