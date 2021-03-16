import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Row } from "react-bootstrap";
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
  const [authenticated, setAuthenticated] = useState(false);
  const [stockData, setStockData] = useState({
    name: "",
    stock_info: [
      {
        stock_name: "",
        stock_price: "",
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

  const { name } = useParams<RouteMatchParams>();

  const listStocks = stockData.stock_info.map((stockInfo, id) => (
    <StockInfo
      key={id}
      stock_name={stockInfo.stock_name}
      stock_price={stockInfo.stock_price}
    />
  ));

  const allowed = () => (
    <Container>
      <Row className="justify-content-center my-3">
        <h1>{name}</h1>
      </Row>
      <Row className="justify-content-center my-3">
        <Button href="/portfolios" variant="outline-danger">
          Delete portfolio
        </Button>
      </Row>
      <Container>{listStocks}</Container>
    </Container>
  );

  const denied = () => (
    <Row>
      <Alert variant="danger">
        <p>You do not have permission to access {name}</p>
      </Alert>
    </Row>
  );

  return <Container>{authenticated ? allowed() : denied()}</Container>;
};

export default PortfolioPage;
