import { useEffect } from "react";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import portfolioActions from "../redux/actions/portfolioActions";

interface Props {
  name: string;
}

interface StateProps {
  loading: boolean;
  perf: PerformanceEntry;
}

interface DispatchProps {
  getPerformance: (payload: PortfolioPerfParams) => void;
}

interface PerformanceEntry {
  [key: string]: any;
}

interface PortfolioPerfParams {
  names: Array<string>;
}

const PortfolioPerformance: React.FC<Props & StateProps & DispatchProps> = (props) => {
  const { name, loading, perf, getPerformance } = props;

  useEffect(() => {
    getPerformance({ names: [name] })
  }, [getPerformance, name]);

  const error =
    perf.hasOwnProperty(name) && perf[name].hasOwnProperty("error")
      ? perf[name].error
      : "";

  let performance;
  if (
    perf.hasOwnProperty(name) &&
    perf[name].hasOwnProperty("portfolio_change")
  ) {
    if (perf[name].portfolio_change === "N/A") {
      performance = <Col as="h5">N/A</Col>;
    } else if (perf[name].portfolio_change > 0) {
      performance = (
        <Col as="h5" style={{ color: "green" }}>
          {`⬆️ $+${Number(perf[name].portfolio_change).toFixed(2)}`}
        </Col>
      );
    } else {
      performance = (
        <Col as="h5" style={{ color: "red" }}>
          {`⬇️ $${Number(perf[name].portfolio_change).toFixed(2)}`}
        </Col>
      );
    }
  } else {
    performance = <Col as="h5">0</Col>;
  }

  const performanceComponent = error ? (
    <Alert variant="danger">{error}</Alert>
  ) : (
    <Row className="my-2">
      <Col as="h5">
        <b>Performance</b>
      </Col>
      {performance}
    </Row>
  );

  return (
    <Container>
      {loading ? (
        <ClipLoader color="green" loading={loading} />
      ) : (
        performanceComponent
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.portfolioReducer.getPortfolioPerf.loading,
  perf: state.portfolioReducer.getPortfolioPerf.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getPerformance: (payload: PortfolioPerfParams) =>
      dispatch(portfolioActions.getPortfolioPerf(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioPerformance);
