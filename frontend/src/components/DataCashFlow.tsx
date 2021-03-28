import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import { Container, Row, Col, Alert } from "react-bootstrap";
import stockActions from "../redux/actions/stockActions";

interface IObjectKeys {
  [key: string]: AttributeValues;
}

interface AttributeValues {
  name: string;
}

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

const formatMap: IObjectKeys = {
  stockticker: {name: "Company Symbol"},
  fiscaldateending: {name: "Year Ending"},
  paymentsforoperatingactivities: {name: "Payments for Operating Activities"},
  operatingcashflow: {name: "Operating Cash Flow"},
  changeinoperatingliabilities: {name: "Change in Operating Liabilities"},
  changeinoperatingassets: {name: "Change in Operating Assets"},
  depreciationdepletionandamortization: {name: "Depreciation Depletion and Amortisation"},
  changeininventory: {name: "Change in Inventory"},
  cashflowfrominvestment: {name: "Cash Flow from Investment"},
  cashflowfromfinancing: {name: "Cash Flow from Financing"},
  dividendpayout: {name: "Dividend Payout"},
  proceedsfromrepurchaseofequity: {name: "Proceeds From Repurchase Of Equity"},
  changeincashandcashequivalents: {name: "Change in Cash"},
  netincome: {name: "Net Income"},
};

const DataCashFlow: React.FC<Props & StateProps & DispatchProps> = (props) => {
  const { symbol, loading, error, data, getStockCashFlow } = props;

  useEffect(() => {
    getStockCashFlow({ symbol });
  }, []);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Data ...</h5>
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
        {data.map((entry: CashFlowEntry) => (
          <Col>
            <hr />
            {Object.entries(entry).map(([field, value]) => (
              <div>
                <Row lg={6}>
                  <Col className="text-left" lg={6}>
                    <span>
                      <b>{formatMap[field].name}</b>
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

  return loading ? loadingSpinnerComponent : tableComponent;
}

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.cashFlow.loading,
  error: state.stockReducer.cashFlow.error,
  data: state.stockReducer.cashFlow.data,
});

const mapDispatchToProps = (dispatch: any) => ({
  getStockCashFlow: (payload: getStockCashFlowParams) => dispatch(stockActions.getStockCashFlow(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(DataCashFlow);


