import { useEffect, useState } from "react";
import { Alert, Button, Container, Col, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import portfolioAPI from "../api/portfolioAPI";
import AddInvestmentForm from "../components/AddInvestmentForm";
import EditPortfolioForm from "../components/EditPortfolioForm";
import StockInfo from "../components/StockInfo";
import ClipLoader from "react-spinners/ClipLoader";

interface Props {
  token?: string;
}

interface RouteMatchParams {
  name: string;
}

interface StockInfo {
  investmentID: string;
  NumShares: number;
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
  const [stockLoading, setStockLoading] = useState(true);
  const [stockDeleting, setStockDeleting] = useState(false);

  useEffect(() => {
    portfolioAPI.getStocks(name).then((portfolioStocks) => {
      setStockData(portfolioStocks.data);
      setStockLoading(false);
    });
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
    <StockInfo key={id} portfolio_name={name} {...stockInfo} />
  ));

  const handleDeletePortfolioClick = () => {
    setStockDeleting(true);
    const deletePortfolio = async () => {
      await portfolioAPI.deletePortfolio(name);
    };
    deletePortfolio();
    setStockDeleting(false);
  };

  const handleInvestmentAdded = () => {
    portfolioAPI.getStocks(name).then((portfolioStocks) => {
      setStockData(portfolioStocks.data);
      setAddingStock(false);
    });
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
      {stockLoading ? (
        <Container fluid className="mt-2">
          <ClipLoader color="blue" loading={stockLoading} />
        </Container>
      ) : (
        <Container fluid className="px-0">
          {listStocks}
        </Container>
      )}
      <Row className="justify-content-center mt-5">
        <Col>
          {addingStock ? (
            <AddInvestmentForm handleInvestmentAdded={handleInvestmentAdded} />
          ) : (
            <Button variant="primary" onClick={() => setAddingStock(true)}>
              Add Investment
            </Button>
          )}
        </Col>
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
          {stockDeleting ? (
            <Spinner animation="border" />
          ) : (
            <Button
              href="/portfolios"
              variant="outline-danger"
              onClick={handleDeletePortfolioClick}
            >
              Delete Portfolio
            </Button>
          )}
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
