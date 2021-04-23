import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import portfolioActions from "../redux/actions/portfolioActions";

interface Props {
  name: string;
}

interface StateProps {
  loading: PerfLoading;
  performance: PerfData;
}

interface DispatchProps {
  getPerformance: (payload: PortfolioPerfParams) => void;
}

interface PerfLoading {
  [key: string]: boolean;
}

interface PerfData {
  [key: string]: PerformanceEntry;
}

interface PerformanceEntry {
  portfolio_change: string | number;
  investments: Array<{ [key: string]: any }>;
}

interface PortfolioPerfParams {
  name: string;
}

const PortfolioPerformance: React.FC<Props & StateProps & DispatchProps> = (
  props
) => {
  const { name, loading, performance, getPerformance } = props;

  useEffect(() => {
    getPerformance({ name });
  }, [getPerformance, name]);

  let portfolioPerformance;
  if (performance && performance.hasOwnProperty(name)) {
    if (performance[name].portfolio_change === "N/A") {
      portfolioPerformance = <Col as="h5">N/A</Col>;
    } else if (performance[name].portfolio_change > 0) {
      portfolioPerformance = (
        <Col as="h5" style={{ color: "green" }}>
          {`⬆️ +${Number(performance[name].portfolio_change).toFixed(2)}%`}
        </Col>
      );
    } else {
      portfolioPerformance = (
        <Col as="h5" style={{ color: "red" }}>
          {`⬇️ ${Number(performance[name].portfolio_change).toFixed(2)}%`}
        </Col>
      );
    }
  } else {
    portfolioPerformance = <Col as="h5">0</Col>;
  }

  const loadingSpinnerComponent = (
    <ClipLoader color="green" loading={loading[name]} />
  );
  const portfolioPerformanceComponent = (
    <Row className="my-2">
      <Col as="h5">
        <b>Performance</b>
      </Col>
      {portfolioPerformance}
    </Row>
  );

  return (
    <Container>
      {loading && loading[name]
        ? loadingSpinnerComponent
        : portfolioPerformanceComponent}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.portfolioReducer.getPortfolioPerf.loading,
  performance: state.portfolioReducer.getPortfolioPerf.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getPerformance: (payload: PortfolioPerfParams) =>
      dispatch(portfolioActions.getPortfolioPerf(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortfolioPerformance);
