import { Container, Col, Row, Alert } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";

interface Props {}

interface StateProps {
  loading: boolean;
  data: Array<any>;
  error: string;
}

interface DispatchProps {
  // getScreenerResults: (payload: getScreenerResultsParams);
}

const ScreenersResults: React.FC<Props & StateProps & DispatchProps> = (
  props
) => {
  const { loading, error, data } = props;

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Data ...</h5>
    </div>
  );

  const alertComponent = <Alert variant="danger">{error}</Alert>;

  const tableComponent = (
    <Container>
      <Row className="justify-content-center">
        <h1>Results</h1>
      </Row>
      <hr />
      <Container className="py-3 bg-dark">
        <Row>
          <Col className="text-center" lg={1}>
            Symbol
          </Col>
          <Col className="text-center" lg={2}>
            Price
          </Col>
          <Col className="text-center" lg={1}>
            Price Change
          </Col>
          <Col className="text-center" lg={2}>
            Price Change (%)
          </Col>
          <Col className="text-center" lg={2}>
            Volume
          </Col>
          <Col className="text-center" lg={2}>
            Market Cap
          </Col>
          <Col className="text-center" lg={2}>
            PE Ratio
          </Col>
        </Row>
        <hr style={{ borderTop: "1px solid white" }} />
        {error ? alertComponent : null}
        {loading
          ? loadingSpinnerComponent
          : data.map((entry: any, idx) => (
              <Row>
                <Col className="text-center" lg={1}>
                  <a href={`/stock/${entry["stock ticker"]}`}>
                    {entry["stock ticker"]}
                  </a>
                </Col>
                <Col className="text-right" lg={2}>
                  {entry["price"]}
                </Col>
                <Col className="text-right" lg={1}>
                  {entry["price change"]}
                </Col>
                <Col className="text-right" lg={2}>
                  {(Number(entry["price change percentage"]) * 100).toFixed(4)}
                </Col>
                <Col className="text-right" lg={2}>
                  {entry["volume"]}
                </Col>
                <Col className="text-right" lg={2}>
                  {entry["market capitalization"]}
                </Col>
                <Col className="text-right" lg={2}>
                  {entry["PE ratio"]}
                </Col>
                <hr />
              </Row>
            ))}
      </Container>
    </Container>
  );

  return tableComponent;
};

const mapStateToProps = (state: any) => ({
  loading: state.screenerReducer.results.loading,
  error: state.screenerReducer.results.error,
  data: state.screenerReducer.results.data,
});

const mapDispatchToProps = (state: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ScreenersResults);
