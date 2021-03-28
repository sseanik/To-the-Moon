import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import { Container, Row, Col, Alert } from "react-bootstrap";

import {
  fundamentalsFormatter as formatMap
} from "../helpers/ObjectFormatRules";

export interface fundamentalDataT {
  company_name: string;
  exchange: string;
  currency: string;
  year_high: number;
  year_low: number;
  market_cap: number;
  beta: number;
  pe_ratio: number;
  eps: number;
  dividend_yield: number;
}

export const defaultFundamentalData = {
  company_name: "",
  exchange: "",
  currency: "",
  year_high: 0,
  year_low: 0,
  market_cap: 0,
  beta: 0,
  pe_ratio: 0,
  eps: 0,
  dividend_yield: 0,
}

interface StateProps {
  loading: boolean;
  data: fundamentalDataT;
  error: string;
}


const DataFundamentals: React.FC<StateProps> = (props) => {
  const { loading, error, data } = props;

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Statistics ...</h5>
    </div>
  );

  const alertComponent = (
    <Alert variant="danger">
      {error}
    </Alert>
  );

  const tableComponent = (
    <Container>
      <Row>
        { error ? alertComponent : null }
      </Row>
      <Row>
        <Col>
          <hr />
          {Object.entries(data).map(([field, value]) => (
            <div>
              <Row lg={6}>
                <Col className="text-left" lg={6}>
                  <span>
                    <b>{formatMap[field] ? formatMap[field].name : field}</b>
                  </span>
                </Col>
                <Col className="text-right" lg={6}>
                  <span>
                    {value}
                  </span>
                </Col>
              </Row>
              <hr />
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );

  return loading ? loadingSpinnerComponent : tableComponent;
}

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.basic.loading,
  error: state.stockReducer.basic.error,
  data: state.stockReducer.basic.data.fundamentals,
});

export default connect(mapStateToProps)(DataFundamentals);
