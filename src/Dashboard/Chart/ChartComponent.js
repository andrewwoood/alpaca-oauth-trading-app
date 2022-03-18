import React from "react";
import Chart from "./Chart";
import { TypeChooser } from "react-stockcharts/lib/helper";

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
    return (
      <TypeChooser>
        {(type) => <Chart type={type} data={this.props.data} />}
      </TypeChooser>
    );
  }
}

export default ChartComponent;
