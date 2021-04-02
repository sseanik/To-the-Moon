import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import { Container, Row, Col, Alert } from "react-bootstrap";
import stockActions from "../redux/actions/stockActions";
import {
  balanceSheetFormatter as formatMap
} from "../helpers/ObjectFormatRules";

interface BalanceSheetEntry {
  fiscaldateending: string;
  total_assets: number;
  total_curr_assets: number;
  total_ncurr_assets: number;
  total_liabilities: number;
  total_curr_liabilities: number;
  total_ncurr_liabilities: number;
  total_equity: number;
}

interface getStockBalanceParams {
  symbol: string;
}

interface Props {
  symbol: string;
}

interface StateProps {
  loading: boolean;
  data: Array<BalanceSheetEntry>;
  error: string;
}

interface DispatchProps {
  getStockBalance: (payload: getStockBalanceParams) => void;
}

const DataBalanceSheet: React.FC<Props & StateProps & DispatchProps> = (props) => {
  const { symbol, loading, error, data, getStockBalance } = props;

  useEffect(() => {
    getStockBalance({ symbol });
  }, []);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Balance Sheet ...</h5>
    </div>
  );

  const alertComponent = (
    <Alert variant="danger">
      {error}
    </Alert>
  );

  const tableComponent = (
    <Container className="financials-container-scrolling">
      <Row>
        {data.map((entry: BalanceSheetEntry) => (
          <Col>
            <hr />
            {Object.entries(entry).map(([field, value]) => (
              <div>
                <Row lg={6}>
                  <Col className="text-left" lg={6}>
                    <span>
                      {formatMap.hasOwnProperty(field) && formatMap[field].hasOwnProperty("name") ? formatMap[field].name : field}
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

  return loading ? loadingSpinnerComponent : (error ? alertComponent : tableComponent);
}

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.balance.loading,
  error: state.stockReducer.balance.error,
  data: state.stockReducer.balance.data,
});

const mapDispatchToProps = (dispatch: any) => ({
  getStockBalance: (payload: getStockBalanceParams) => dispatch(stockActions.getStockBalance(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(DataBalanceSheet);
