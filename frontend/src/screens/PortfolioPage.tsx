import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import portfolioAPI from "../api/portfolioAPI";
import StockInfo from "../components/StockInfo";

interface Props {
  token?: string;
}

interface RouteMatchParams {
  name: string;
}

const PortfolioPage: React.FC<Props> = (props) => {
  const { token } = props;
  const { name } = useParams<RouteMatchParams>();
  const [authenticated, setAuthenticated] = useState(false);
  const [stockData, setStockData] = useState({
    name: "",
    stock_info: [
      {
        stock_name: "",
        stock_price: "",
        purchase_date: "",
        purchase_price: "",
        num_shares: "",
      },
    ],
  });

  useEffect(() => {
    const fetchStocks = async () => {
      const stockInfo = portfolioAPI.getStocks(name);
      setStockData(stockInfo);
    };
    fetchStocks();
  });

  // may be removed soon
  useEffect(() => {
    if (token !== "" || window.localStorage.getItem("Token")) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [token]);

  const listStocks = stockData.stock_info.map((stockInfo, id) => (
    <StockInfo
      key={id}
      stock_name={stockInfo.stock_name}
      stock_price={stockInfo.stock_price}
      purchase_date={stockInfo.purchase_date}
      purchase_price={stockInfo.purchase_price}
      num_shares={stockInfo.num_shares}
    />
  ));

  const handleDeletePortfolioClick = () => {
    const deletePortfolio = async () => {
      portfolioAPI.deletePortfolio(name);
    };
    deletePortfolio();
  };

  const allowed = () => (
    <Container fluid>
      <Row className="justify-content-center my-3">
        <h1>{name}</h1>
      </Row>
      <Row className="justify-content-center my-3">
        <Button
          href="/portfolios"
          variant="outline-danger"
          onClick={handleDeletePortfolioClick}
        >
          Delete Portfolio
        </Button>
      </Row>
      <Row className="border-bottom border-secondary my-2 w-100 font-weight-bold">
        <Col>Stock Name</Col>
        <Col>Stock Price</Col>
        <Col>Purchase Date</Col>
        <Col>Purchase Price</Col>
        <Col># Shares</Col>
        <Col>Delete Stock</Col>
      </Row>
      <Container fluid>{listStocks}</Container>
    </Container>
  );

  const denied = () => (
    <Row>
      <Alert variant="danger">
        <p>You do not have permission to access {name}</p>
      </Alert>
    </Row>
  );

  return <Container fluid>{authenticated ? allowed() : denied()}</Container>;
};

export default PortfolioPage;
