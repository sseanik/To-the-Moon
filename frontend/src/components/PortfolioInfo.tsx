import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { Col, Container, Row, Button } from "react-bootstrap";
import investmentActions from "../redux/actions/investmentActions";
import ClipLoader from "react-spinners/ClipLoader";
import { DeletePortfolioButton, PortfolioPerformance, StockInfo } from ".";
import { StockParams } from "../screens/PortfolioPage";

interface Props {
  name: string;
  viewOnly?: boolean;
  detailed?: boolean;
}

interface StateProps {
  loading: { [key: string]: boolean };
  stocks: { [key: string]: Array<StockParams> };
}

interface DispatchProps {
  getStocks: (portfolioName: string) => void;
}

const PortfolioInfo: React.FC<Props & StateProps & DispatchProps> = (props) => {
  const {
    name,
    viewOnly = false,
    detailed = false,
    loading,
    stocks,
    getStocks,
  } = props;

  const portfolioLoading: boolean =
    loading && loading.hasOwnProperty(name) ? loading[name] : false;
  const portfolioStocks: Array<StockParams> =
    stocks && stocks.hasOwnProperty(name) ? stocks[name] : [];

  useEffect(() => {
    getStocks(name);
  }, [getStocks, name]);

  return (
    <Container>
      <h2 className="my-2">{name}</h2>
      <PortfolioPerformance name={name} />
      {detailed ? (
        <Row className="py-1 justify-content-center">
          <Row className="w-100 justify-content-center">
            <Col className="font-weight-bold">Stock Name</Col>
            <Col className="font-weight-bold"># Shares</Col>
            <Col className="font-weight-bold">Purchase Date</Col>
            <Col className="font-weight-bold">Purchase Price</Col>
            <Col className="font-weight-bold">Total Change</Col>
            {!viewOnly ? (
              <Col className="font-weight-bold">Delete Stock</Col>
            ) : null}
          </Row>
          <Row className="w-100 justify-content-center portfolio-details">
            <ClipLoader color="green" loading={portfolioLoading} />
            {portfolioStocks.map((stockProps, idx: number) => (
              <Row
                className="w-100 align-items-center justify-content-center"
                key={idx}
              >
                <StockInfo {...stockProps} viewOnly={viewOnly} />
              </Row>
            ))}
          </Row>
        </Row>
      ) : null}
      <Container fluid className="py-1 w-75">
        <Row>
          <Col className="align-middle">
            <Button className="portfolio-controls" href={`/portfolio/${name}`}>
              <FontAwesomeIcon icon={faEdit} size="2x" />
            </Button>
          </Col>
          {!viewOnly ? (
            <Col>
              <DeletePortfolioButton portfolioName={name} />{" "}
            </Col>
          ) : null}
        </Row>
      </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioInfo);
