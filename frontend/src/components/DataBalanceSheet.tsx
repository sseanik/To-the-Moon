import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import stockActions from "../redux/actions/stockActions";
import { balanceSheetFormatter as formatMap } from "../helpers/ObjectFormatRules";

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

const DataBalanceSheet: React.FC<Props & StateProps & DispatchProps> = (
  props
) => {
  const { symbol, loading, error, data, getStockBalance } = props;

  useEffect(() => {
    getStockBalance({ symbol });
  }, [getStockBalance, symbol]);

  const getTextCSSClass = (format: string) => {
    const result =
      format === "bold"
        ? "font-weight-bold"
        : format === "italic"
        ? "font-italic"
        : format === "normal"
        ? "font-weight-normal"
        : format === "light"
        ? "font-weight-light"
        : "font-weight-normal";
    return result;
  };

  const getTextIndentClass = (level: number) => {
    return level === 1
      ? "financials-subhead-1"
      : level === 2
      ? "financials-subhead-2"
      : level === 3
      ? "financials-subhead-3"
      : "";
  };

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Balance Sheet ...</h5>
    </div>
  );

  const tableComponent = (
    <Container className="financials-container-scrolling">
      <Row>
        {data
          ? data.map((entry: BalanceSheetEntry, idx) => (
              <Col key={idx}>
                <hr />
                {Object.entries(entry).map(([field, value], idx) => (
                  <div key={idx}>
                    <Row lg={6}>
                      <Col
                        className={
                          "text-left " +
                          (formatMap.hasOwnProperty(field) &&
                          formatMap[field].hasOwnProperty("format")
                            ? getTextCSSClass(formatMap[field].format)
                            : "font-weight-normal") +
                          " " +
                          (formatMap.hasOwnProperty(field) &&
                          formatMap[field].hasOwnProperty("indent")
                            ? getTextIndentClass(formatMap[field].indent)
                            : "")
                        }
                        lg={6}
                      >
                        <span>
                          {formatMap.hasOwnProperty(field) &&
                          formatMap[field].hasOwnProperty("name")
                            ? formatMap[field].name
                            : field}
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
            ))
          : null}
      </Row>
    </Container>
  );

  return loading ? loadingSpinnerComponent : error ? <></> : tableComponent;
};

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.balance.loading,
  error: state.stockReducer.balance.error,
  data: state.stockReducer.balance.data,
});

const mapDispatchToProps = (dispatch: any) => ({
  getStockBalance: (payload: getStockBalanceParams) =>
    dispatch(stockActions.getStockBalance(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataBalanceSheet);
