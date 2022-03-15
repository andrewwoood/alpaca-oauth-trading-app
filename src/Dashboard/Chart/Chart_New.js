import React from "react";
import PropTypes from "prop-types";
import "./Chart.scss";

import { scaleTime } from "d3-scale";
import { utcDay, utcMinute } from "d3-time";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";

class CandleStickChart extends React.Component {
  render() {
    const { type, data } = this.props;
    console.log("Here Inside Chart");
    console.log(data);
    const height = 500;
    const width = 1000;
    const ratio = 3;
    const margin = { left: 50, right: 50, top: 10, bottom: 30 };
    const xAccessor = (d) => d.date;
    const xExtents = [
      xAccessor(data[data.length - 100]),
      xAccessor(last(data)),
    ];
    console.log(xExtents);
    console.log(xExtents[0] > xExtents[1]);
    return (
      <ChartCanvas
        height={height}
        ratio={ratio}
        width={width}
        margin={margin}
        type={type}
        seriesName="BTCUSD"
        data={data}
        xAccessor={xAccessor}
        xScale={scaleTime()}
        xExtents={xExtents}
      >
        <Chart id={2} yExtents={(d) => [d.high, d.low]}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6} />
          <YAxis axisAt="left" orient="left" ticks={5} />
          <CandlestickSeries width={timeIntervalBarWidth(utcMinute)} />
          {/* <CandlestickSeries width={timeIntervalBarWidth(utcDay)} /> */}
        </Chart>
      </ChartCanvas>
    );
  }
}

CandleStickChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
  type: "svg",
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
