import { useEffect, useState } from "react";
import { Container, Col, Row, Alert, Button, Tabs, Tab } from "react-bootstrap";
import { useParams } from "react-router";
import { NoteRelevant } from "../components";
import AddInvestmentForm from "../components/AddInvestmentForm";
import EditPortfolioForm from "../components/EditPortfolioForm";
import StockInfo from "../components/StockInfo";
import ClipLoader from "react-spinners/ClipLoader";
import investmentActions from "../redux/actions/investmentActions";
import { connect } from "react-redux";

interface StockParams {
  investment_id: string;
  stock_ticker: string;
  num_shares: number;
  purchase_date: string;
  purchase_price: string;
  total_change: number;
}

interface StateProps {
  loading: boolean;
  error: Object;
  stocks: Array<StockParams>;
}

interface DispatchProps {
  getStocks: (portfolioName: string) => void;
}

interface RouteMatchParams {
  name: string;
}

const PortfolioPage: React.FC<StateProps & DispatchProps> = (props) => {
  const { name } = useParams<RouteMatchParams>();
  const { loading, error, stocks, getStocks } = props;

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getStocks(name);
  }, [getStocks, name]);

  return (
    <Container fluid>
      <Row className="justify-content-center my-3">
        <h1>{name}</h1>
      </Row>
      <Row className="border-bottom border-secondary py-2 w-100 font-weight-bold align-items-center">
        <Col>Stock Name</Col>
        <Col># Shares</Col>
        <Col>Purchase Date</Col>
        <Col>Purchase Price</Col>
        <Col>Total Change</Col>
        <Col>Delete Stock</Col>
      </Row>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading ? (
        <ClipLoader color="green" loading={loading} />
      ) : (
        stocks.map((stockProps, id) => <StockInfo key={id} {...stockProps} />)
      )}
      <Row className="justify-content-center mt-4">
        <Col>
          {adding ? (
            <Button variant="light" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          ) : (
            <Button variant="light" onClick={() => setAdding(true)}>
              Add Investment
            </Button>
          )}
        </Col>
        <Col>
          {editing ? (
            <Button variant="light" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          ) : (
            <Button variant="light" onClick={() => setEditing(true)}>
              Edit Portfolio
            </Button>
          )}
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col>{adding ? <AddInvestmentForm /> : null}</Col>
        <Col>{editing ? <EditPortfolioForm /> : null}</Col>
      </Row>
      <Row>
        <Container>
          <Tabs className="justify-content-center mt-2" defaultActiveKey="notes">
            <Tab eventKey="notes" title="Relevant Notes">
              <Row>
                <NoteRelevant portfolio={name} />
              </Row>
            </Tab>
          </Tabs>
        </Container>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.investmentReducer.getStocks.loading,
  stocks: state.investmentReducer.getStocks.stocks,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getStocks: (portfolioName: string) =>
      dispatch(investmentActions.getStocks(portfolioName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioPage);
