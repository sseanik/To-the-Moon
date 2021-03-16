import React from "react";
import { Row, Col } from "react-bootstrap";

interface Props {
  stock_name: string;
  stock_price: string;
}

const StockInfo: React.FC<Props> = (props) => {
  const { stock_name, stock_price } = props;
  return (
    <Row>
      <Col>{stock_name}</Col>
      <Col>{stock_price}</Col>
    </Row>
  );
};

export default StockInfo;
