import React from "react";
import { Button, Row, Col } from "react-bootstrap";

interface Props {
  stock_name: string;
  stock_price: string;
  purchase_date: string;
  purchase_price: string;
  num_shares: string;
}

const StockInfo: React.FC<Props> = (props) => {
  const {
    stock_name,
    stock_price,
    purchase_date,
    purchase_price,
    num_shares,
  } = props;

  const handleDeleteStockClick = () => {
    const deleteStock = async () => {};
  };

  return (
    <Row className="border-bottom border-light my-2 w-100">
      <Col>{stock_name}</Col>
      <Col>{stock_price}</Col>
      <Col>{purchase_date}</Col>
      <Col>{purchase_price}</Col>
      <Col>{num_shares}</Col>
      <Col>
        <Button variant="outline-danger" onClick={handleDeleteStockClick}>
          Remove
        </Button>
      </Col>
    </Row>
  );
};

export default StockInfo;
