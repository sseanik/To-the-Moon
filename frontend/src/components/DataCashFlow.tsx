import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import { Container, Row, Col, Alert } from "react-bootstrap";
import stockActions from "../redux/actions/stockActions";
import { cashFlowStatementFormatter as formatMap } from "../helpers/ObjectFormatRules";

interface CashFlowEntry {
  stockticker: string;
  fiscaldateending: string;
  operatingcashflow: string;
  paymentsforoperatingactivities: string;
  changeinoperatingliabilities: string;
  changeinoperatingassets: string;
  depreciationdepletionandamortization: string;
  changeininventory: string;
  cashflowfrominvestment: string;
  cashflowfromfinancing: string;
  dividendpayout: string;
  proceedsfromrepurchaseofequity: string;
  changeincashandcashequivalents: string;
  netincome: string;
}

interface getStockCashFlowParams {
  symbol: string;
}

interface Props {
  symbol: string;
}

interface StateProps {
  loading: boolean;
  data: Array<CashFlowEntry>;
  error: string;
}

interface DispatchProps {
  getStockCashFlow: (payload: getStockCashFlowParams) => void;
}

const DataCashFlow: React.FC<Props & StateProps & DispatchProps> = (props) => {
  const { symbol, loading, error, data, getStockCashFlow } = props;

  useEffect(() => {
    getStockCashFlow({ symbol });
  }, [getStockCashFlow, symbol]);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Data ...</h5>
    </div>
  );

  const alertComponent = <Alert variant="danger">{error}</Alert>;

  const tableComponent = (
    <Container className="financials-container-scrolling">
      <Row>
        {data.map((entry: CashFlowEntry, idx) => (
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
        ))}
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
  loading: state.stockReducer.cashFlow.loading,
  error: state.stockReducer.cashFlow.error,
  data: state.stockReducer.cashFlow.data,
});

const mapDispatchToProps = (dispatch: any) => ({
  getStockCashFlow: (payload: getStockCashFlowParams) =>
    dispatch(stockActions.getStockCashFlow(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataCashFlow);
