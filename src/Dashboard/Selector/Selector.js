import React from "react";
import "./Selector.scss";
import symbols from "./symbol-data.json";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";

class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbolData: symbols,
    };
  }

  render() {
    return (
      <div>
        <Table className="buttons" size="sm">
          <Thead>
            <Tr>
              {/* <Th>Symbol</Th> */}
              <Th>Render Data</Th>
            </Tr>
          </Thead>
          <Tbody>
            {this.state.symbolData.map((symbol) => (
              <Tr>
                {/* <Td>{symbol.symbol}</Td> */}
                <Button onClick={() => this.props.handler(symbol.symbol)}>
                  {symbol.symbol}
                </Button>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    );
  }
}

export default Selector;
