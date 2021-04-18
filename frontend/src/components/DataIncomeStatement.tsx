import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import { Container, Row, Col, Alert } from "react-bootstrap";
import stockActions from "../redux/actions/stockActions";
import { incomeStatementFormatter as formatMap } from "../helpers/ObjectFormatRules";

interface IncomeStatementEntry {
  stockticker: string;
  fiscaldateending: string;
  totalrevenue: string;
  costofrevenue: string;
  grossprofit: string;
  operatingexpenses: string;
  operatingincome: string;
  incomebeforetax: string;
  interestincome: string;
  netinterestincome: string;
  ebit: string;
  ebitda: string;
  netincome: string;
}

interface getStockIncomeParams {
  symbol: string;
}

interface Props {
  symbol: string;
}

interface StateProps {
  loading: boolean;
  data: Array<IncomeStatementEntry>;
  error: string;
}

interface DispatchProps {
  getStockIncome: (payload: getStockIncomeParams) => void;
}

const DataIncomeStatement: React.FC<Props & StateProps & DispatchProps> = (
  props
) => {
  const { symbol, loading, error, data, getStockIncome } = props;

  useEffect(() => {
    getStockIncome({ symbol });
  }, [getStockIncome, symbol]);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Income Statement ...</h5>
    </div>
  );

  const alertComponent = <Alert variant="danger">{error}</Alert>;

  const tableComponent = (
    <Container className="financials-container-scrolling">
      <Row>
        {data ? data.map((entry: IncomeStatementEntry, idx) => (
          <Col key={idx}>
            <hr />
            {Object.entries(entry).map(([field, value], idx) => (
              <div key={idx}>
                <Row lg={6}>
                  <Col className="text-left" lg={6}>
                    <span>
                      <b>
                        {formatMap.hasOwnProperty(field) &&
                        formatMap[field].hasOwnProperty("name")
                          ? formatMap[field].name
                          : field}
                      </b>
                    </span>
                  </Col>
                  <Col className="text-right" lg={6}>
                    <span>
                      {typeof value === "string" ? value : value / 1000}
                    </span>
                  </Col>
                </Row>
                <hr />
              </div>
            ))}
          </Col>
        )) : null}
      </Row>
    </Container>
  );

  return loading
    ? loadingSpinnerComponent
    : error
    ? alertComponent
    : tableComponent;
};

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.income.loading,
  error: state.stockReducer.income.error,
  data: state.stockReducer.income.data,
});

const mapDispatchToProps = (dispatch: any) => ({
  getStockIncome: (payload: getStockIncomeParams) =>
    dispatch(stockActions.getStockIncome(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataIncomeStatement);
