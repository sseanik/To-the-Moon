import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Container, Row, Alert, Button } from "react-bootstrap";
import DeletePortfolioButton from "./DeletePortfolioButton";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";

interface Props {
  name: string;
}

interface StateProps {
  loading: boolean;
  perf: PerformanceEntry;
}

export interface PerformanceEntry {
  [key: string]: any;
}

const performanceStyle = {};

const PortfolioInfo: React.FC<Props & StateProps> = (props) => {
  const { name, loading, perf } = props;

  const error =
    perf.hasOwnProperty(name) && perf[name].hasOwnProperty("error")
      ? perf[name].error
      : "";
  const performance =
    perf.hasOwnProperty(name) && perf[name].hasOwnProperty("portfolio_change")
      ? Number(perf[name].portfolio_change).toFixed(2)
      : 0;

  const performanceComponent = error ? (
    <Alert variant="danger">{error}</Alert>
  ) : (
    <Row className="my-2">
      <Col as="h5">
        <b>Performance</b>
      </Col>
      <Col as="h5">
        {performance > 0 ? `⬆️ +${performance}` : `⬇️ ${performance}`}
      </Col>
    </Row>
  );

  return (
    <Col
      className="border rounded mx-1 p-4 portfolio-info bg-light"
      lg={4}
      md={6}
    >
      <h2 className="my-2">{name}</h2>
      {loading ? (
        <ClipLoader color="green" loading={loading} />
      ) : (
        performanceComponent
      )}
      <Container fluid className="w-75">
        <Row>
          <Col className="align-middle">
            <Button className="portfolio-controls" href={`/portfolio/${name}`}>
              <FontAwesomeIcon icon={faSignInAlt} size="2x" />
            </Button>
          </Col>
          <Col>
            <DeletePortfolioButton portfolioName={name} />
          </Col>
        </Row>
      </Container>
    </Col>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.portfolioReducer.getPortfolioPerf.loading,
  perf: state.portfolioReducer.getPortfolioPerf.data,
});

export default connect(mapStateToProps)(PortfolioInfo);
