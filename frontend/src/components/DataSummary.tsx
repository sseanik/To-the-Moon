import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { summaryFormatter as formatMap } from "../helpers/ObjectFormatRules";

export interface summaryDataT {
  previous_close: number;
  open: number;
  day_min: number;
  day_max: number;
  year_min: number;
  year_max: number;
  volume: number;
  average_volume: number;
}

export const defaultSummaryData = {
  previous_close: 0,
  open: 0,
  day_min: 0,
  day_max: 0,
  year_min: 0,
  year_max: 0,
  volume: 0,
  average_volume: 0,
};

interface StateProps {
  loading: boolean;
  data: summaryDataT;
  error: string;
}

const DataSummary: React.FC<StateProps> = (props) => {
  const { loading, error, data } = props;

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Data ...</h5>
    </div>
  );

  const tableComponent = (
    <Container className="generic-container-scrolling">
      <Row>
        <Col>
          <hr />
          {data
            ? Object.entries(data).map(([field, value], idx) => (
                <div key={idx}>
                  <Row lg={6}>
                    <Col className="text-left font-weight-bold" lg={6}>
                      <span>
                        {formatMap.hasOwnProperty(field) &&
                        formatMap[field].hasOwnProperty("name")
                          ? formatMap[field].name
                          : field}
                      </span>
                    </Col>
                    <Col className="text-right" lg={6}>
                      <span>{value}</span>
                    </Col>
                  </Row>
                  <hr />
                </div>
              ))
            : null}
        </Col>
      </Row>
    </Container>
  );

  return loading ? loadingSpinnerComponent : error ? <></> : tableComponent;
};

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.basic.loading,
  error: state.stockReducer.basic.error,
  data: state.stockReducer.basic.data.summary,
});

export default connect(mapStateToProps)(DataSummary);
