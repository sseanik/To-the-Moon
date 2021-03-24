import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import stockAPI from "../api/stockAPI";

interface Props {
  investmentID: string;
  NumShares: number;
  PurchaseDate: string;
  PurchasePrice: string;
  StockTicker: string;
  TotalChange: number;
  portfolio_name: string;
}

const StockInfo: React.FC<Props> = (props) => {
  const {
    investmentID,
    NumShares,
    PurchaseDate,
    PurchasePrice,
    StockTicker,
    TotalChange,
  } = props;

  const handleDeleteStockClick = () => {
    const deleteStock = async () => {
      // TODO: FIX THIS, we currently are not tracking investmentIDs in the frontend
      // We need this in order to be able to delete and getInvestmentsByStockTicker
      console.log(investmentID)
      await stockAPI.deleteStock(investmentID);
    };
    deleteStock();
  };

  return (
    <Row className="border-bottom border-light my-2 w-100 align-items-center">
      <Col>{StockTicker}</Col>
      <Col>{NumShares}</Col>
      <Col>{PurchaseDate}</Col>
      <Col>{PurchasePrice}</Col>
      <Col>{TotalChange}</Col>
      <Col>
        <Button variant="outline-danger" onClick={handleDeleteStockClick}>
          Remove
        </Button>
      </Col>
    </Row>
  );
};

export default StockInfo;
