import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import portfolioAPI from "../api/portfolioAPI";
import CreateStockForm from "../components/CreateStockForm";
import EditPortfolioForm from "../components/EditPortfolioForm";
import StockInfo from "../components/StockInfo";

interface Props {
  token?: string;
}

interface RouteMatchParams {
  name: string;
}

interface StockInfo {
  NumShares: number
  PurchaseDate: string;
  PurchasePrice: string;
  StockTicker: string;
  TotalChange: number;
}

const PortfolioPage: React.FC<Props> = (props) => {
  const { token } = props;
  const { name } = useParams<RouteMatchParams>();
  const [authenticated, setAuthenticated] = useState(false);
  const [addingStock, setAddingStock] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(false);
  const [stockData, setStockData] = useState<Array<StockInfo>>([]);

  useEffect(() => {
    portfolioAPI.getStocks(name)
      .then(portfolioStocks => {
        console.log(portfolioStocks.data)
        setStockData(portfolioStocks.data);
      })
  }, []);

  // may be removed soon
  useEffect(() => {
    if (token !== "" || window.localStorage.getItem("Token")) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [token]);

  const listStocks = stockData.map((stockInfo, id) => (
    <StockInfo
      key={id}
      portfolio_name={name}
      {...stockInfo}
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
      <Row></Row>
      <Row className="border-bottom border-secondary py-2 w-100 font-weight-bold align-items-center">
        <Col>Stock Name</Col>
        <Col># Shares</Col>
        <Col>Purchase Date</Col>
        <Col>Purchase Price</Col>
        <Col>Total Change</Col>
        <Col>Delete Stock</Col>
      </Row>
      <Container fluid>{listStocks}</Container>
      <Row className="justify-content-center my-2">
        {addingStock ? (
          <CreateStockForm
            portfolioName={name}
            handleAddStock={() => setAddingStock(false)}
          />
        ) : (
          <Button variant="primary" onClick={() => setAddingStock(true)}>
            Add Stock
          </Button>
        )}
      </Row>
      <Row className="justify-content-center mt-5">
        <Col>
          {editingPortfolio ? (
            <EditPortfolioForm
              handlePortfolioEdited={() => setEditingPortfolio(false)}
            />
          ) : (
            <Button
              variant="outline-success"
              onClick={() => setEditingPortfolio(true)}
            >
              Edit Portfolio
            </Button>
          )}
        </Col>
        <Col>
          <Button
            href="/portfolios"
            variant="outline-danger"
            onClick={handleDeletePortfolioClick}
          >
            Delete Portfolio
          </Button>
        </Col>
      </Row>
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
