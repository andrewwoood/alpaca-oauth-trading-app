// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

import React from "react";
import { render } from "react-dom";
import Chart from "./Dashboard/Chart/Chart_New";
import { getData } from "./Utils";

import { TypeChooser } from "react-stockcharts/lib/helper";

class ChartComponent extends React.Component {
  componentDidMount() {
    getData().then((data) => {
      this.setState({ data });
    });
  }
  // state = {
  //   symbol: "SPY",
  //   data: null,
  //   dummyData: [
  //     {
  //       date: "Tue Jan 05 2010 00:00:00 GMT-0700 (Mountain Standard Time)",
  //       open: 200,
  //       high: 202,
  //       low: 198,
  //       close: 200,
  //       volume: 200000,
  //     },
  //     {
  //       date: "Tue Jan 06 2010 00:00:00 GMT-0700 (Mountain Standard Time)",
  //       open: 200,
  //       high: 202,
  //       low: 198,
  //       close: 200,
  //       volume: 200000,
  //     },
  //     {
  //       date: "Tue Jan 07 2010 00:00:00 GMT-0700 (Mountain Standard Time)",
  //       open: 200,
  //       high: 202,
  //       low: 198,
  //       close: 200,
  //       volume: 200000,
  //     },
  //     {
  //       date: "Tue Jan 08 2010 00:00:00 GMT-0700 (Mountain Standard Time)",
  //       open: 200,
  //       high: 202,
  //       low: 198,
  //       close: 200,
  //       volume: 200000,
  //     },
  //   ],
  // };
  render() {
    if (this.state == null) {
      return <div>Loading...</div>;
    }
    return (
      <TypeChooser>
        {(type) => <Chart type={type} data={this.state.data} />}
      </TypeChooser>
    );
  }
}

render(<ChartComponent />, document.getElementById("root"));
