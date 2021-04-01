import { useState, useEffect, useCallback, useMemo, useRef, Ref } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Alert,
  Badge,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import stockActions from "../redux/actions/stockActions";

import {
  DataSummary,
  DataFundamentals,
  DataIncomeStatement,
  DataBalanceSheet,
  DataCashFlow,
  StockNews,
} from "../components";

import RangeSelectorOptions from "../helpers/RangeSelectorOptions";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Forum from "../components/Forum";

interface seriesT {
  name: string;
  data: Array<Array<number>>;
}

interface titleT {
  text: string;
}

interface graphOptionsT {
  title: titleT;
  series: Array<seriesT>;
}

interface RouteParams {
  symbol: string;
}

interface getStockBasicParams {
  symbol: string;
}

interface getPredictionDailyParams {
  symbol: string;
}

interface durChoiceParams {
  [key: string]: { dur: number; display: string; units: string };
}

interface StateProps {
  loading: boolean;
  error: string;
  company: string;
  priceDataDaily: any;
  priceDataIntraday: any;
  predictionDaily: any;

  predictionDailyLoading: any;
  predictionDailyError: any;
}

interface DispatchProps {
  getStockBasic: (payload: getStockBasicParams) => void;
  getPredictionDaily: (payload: getPredictionDailyParams) => void;
}

const StockPage: React.FC<StateProps & DispatchProps> = (props) => {
  const {
    company,
    loading,
    error,
    priceDataDaily,
    priceDataIntraday,
    predictionDaily,
    getStockBasic,
    getPredictionDaily,
    predictionDailyLoading,
    predictionDailyError,
  } = props;

  const chartComponent = useRef<any|null>(null);
  const params = useParams<RouteParams>();
  const symbol = params.symbol;

  const durOpts: durChoiceParams = useMemo(() => {
    return {
      durDays3: { dur: 3, display: "3", units: "days" },
      durWeeks1: { dur: 5, display: "5", units: "days" },
      durWeeks2: { dur: 10, display: "10", units: "days" },
      durMonths1: { dur: 20, display: "20", units: "days" },
      durMonths2: { dur: 40, display: "40", units: "days" },
      durMonths3: { dur: 60, display: "60", units: "days" },
    };
  }, []);

  /* const durOpts: durChoiceParams = {
    durDays3: { dur: 3, display: "3", units: "days" },
    durWeeks1: { dur: 5, display: "5", units: "days" },
    durWeeks2: { dur: 10, display: "10", units: "days" },
    durMonths1: { dur: 20, display: "20", units: "days" },
    durMonths2: { dur: 40, display: "40", units: "days" },
    durMonths3: { dur: 60, display: "60", units: "days" },
  }; */

  const [displayIntra, setDisplayIntra] = useState<boolean>(false);
  const [graphOptions, setGraphOptions] = useState<graphOptionsT | any>({
    title: {
      text: "Share Price",
    },
    rangeSelector: RangeSelectorOptions(setDisplayIntra),
    series: [{ data: [] }],
  });
  const [durChoice, setdurChoice] = useState<string>("durMonths3");

  const fetchStock = useCallback(() => {
    getStockBasic({ symbol });
  }, [getStockBasic, symbol]);

  const fetchPredictDaily = () => {
    getPredictionDaily({ symbol });
  };

  // TODO: predefined reset length
  const resetZoom = () => {
    if (chartComponent && chartComponent.current && graphOptions.series[0].data) {
      const seriesLimit = graphOptions.series[0].data.length;
      const lower = graphOptions.series[0].data[seriesLimit-60-1][0];
      const upper = graphOptions.series[0].data[seriesLimit-1][0];
      chartComponent.current.chart.xAxis[0].setExtremes(lower, upper);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  useEffect(() => {
    if (displayIntra === true) {
      const seriesIntraList = Object.entries(priceDataIntraday).map((entry) => {
        const [key, value] = entry;
        return { name: key, data: value };
      });
      setGraphOptions((graphOptions: graphOptionsT) => ({
        ...graphOptions,
        series: seriesIntraList,
      }));
    } else {
      const seriesDailyList = Object.entries(priceDataDaily).map((entry) => {
        const [key, value] = entry;
        return { name: key, data: value };
      });
      let predictions = JSON.parse(JSON.stringify(predictionDaily));
      if (predictions.data) {
        predictions.data = predictions.data.slice(0, durOpts[durChoice].dur);
      }

      const displaySeries = predictions
        ? [...seriesDailyList, predictions]
        : seriesDailyList;
      setGraphOptions((graphOptions: graphOptionsT) => ({
        ...graphOptions,
        series: displaySeries,
      }));
    }
  }, [
    displayIntra,
    priceDataDaily,
    priceDataIntraday,
    predictionDaily,
    durChoice,
    durOpts,
  ]);

  const graphComponent = (
    <Container>
      <HighchartsReact
        ref={chartComponent}
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={graphOptions}
      />
      <Row className="justify-content-center">
        <Col>
          <Button variant="outline-info" onClick={fetchStock}>
            Refresh data
          </Button>
          <Button variant="outline-info" onClick={resetZoom}>
            Reset Zoom
          </Button>
        </Col>
      </Row>
    </Container>
  );

  const loadingSpinnerComponent = (
    <Container>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Data ...</h5>
    </Container>
  );

  const alertComponent = <Alert variant="danger">{error}</Alert>;

  const stockNameText = error ? `${symbol}` : `${company} (${symbol})`;

  const statusBadgeModifier = (
    prediction: Array<any>,
    isLoading: boolean,
    error: object | null
  ) => {
    const result =
      prediction !== null && Object.keys(prediction).length > 0 && !isLoading
        ? "success"
        : isLoading
        ? "primary"
        : prediction === null || Object.keys(prediction).length === 0
        ? "secondary"
        : error
        ? "danger"
        : "danger";
    return result;
  };

  const statusBadgeText = (
    prediction: Array<any>,
    isLoading: boolean,
    error: object | null
  ) => {
    const result =
      prediction !== null && Object.keys(prediction).length > 0 && !isLoading
        ? "Fetched"
        : isLoading
        ? "Pending"
        : Object.keys(prediction).length === 0 || prediction === null
        ? "Not requested"
        : error !== null
        ? "Error"
        : "Error";
    return result;
  };

  const predictionControlComponent = (
    <Container>
      <hr />
      <Row>
        <Col>Prediction Status: </Col>
        <Col>
          <Badge
            variant={statusBadgeModifier(
              predictionDaily,
              predictionDailyLoading,
              predictionDailyError
            )}
          >
            {statusBadgeText(
              predictionDaily,
              predictionDailyLoading,
              predictionDailyError
            )}
          </Badge>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>Duration: </Col>
        <Col>
          <DropdownButton
            variant="outline-dark"
            id="dropdown-basic-button"
            title={durOpts[durChoice].display + " " + durOpts[durChoice].units}
          >
            {Object.entries(durOpts).map((entry) => {
              const [key, value] = entry;

              return (
                <Dropdown.Item
                  href="#/action-1"
                  onClick={() => {
                    setdurChoice(key);
                  }}
                >
                  {value.display + " " + value.units}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        </Col>
      </Row>
      <hr />
      <Row>
        <Button
          variant="outline-primary"
          onClick={() => {
            fetchPredictDaily();
          }}
        >
          Predict
        </Button>
      </Row>
    </Container>
  );

  return (
    <Container>
      <Row className="justify-content-center mt-2">
        <h1>{loading ? loadingSpinnerComponent : stockNameText}</h1>
      </Row>
      <Row>{error ? alertComponent : null}</Row>
      <Row className="justify-content-center">
        <Col>
          <Container>
            <Tabs
              className="justify-content-center mt-2"
              defaultActiveKey="summary"
              id="sec-view-info-selector"
            >
              <Tab eventKey="summary" title="Summary">
                <DataSummary />
              </Tab>
              <Tab eventKey="statistics" title="Statistics">
                <DataFundamentals />
              </Tab>
              <Tab eventKey="financials" title="Financials">
                <Tabs
                  className="justify-content-center mt-2"
                  defaultActiveKey="incomestatement"
                  id="sec-view-financials"
                >
                  <Tab eventKey="incomestatement" title="Income Statement">
                    <DataIncomeStatement symbol={symbol} />
                  </Tab>
                  <Tab eventKey="balancesheet" title="Balance Sheet">
                    <DataBalanceSheet symbol={symbol} />
                  </Tab>
                  <Tab eventKey="cashflow" title="Cash Flow Statement">
                    <DataCashFlow symbol={symbol} />
                  </Tab>
                </Tabs>
              </Tab>
              <Tab eventKey="prediction" title="Market Prediction">
                {predictionControlComponent}
              </Tab>
            </Tabs>
          </Container>
        </Col>
        <Col>{loading ? loadingSpinnerComponent : graphComponent}</Col>
      </Row>
      <Row className="justify-content-start my-2">
        <Forum stockTicker={symbol} />
      </Row>
      <Row>
        <Container>
          <Tabs className="justify-content-center mt-2" defaultActiveKey="news">
            <Tab eventKey="news" title="News">
              <Row>
                <h3>{`News related to ${symbol.toUpperCase()}`}</h3>
              </Row>
              <StockNews stock={symbol} />
            </Tab>
            <Tab eventKey="other" title="Other"></Tab>
          </Tabs>
        </Container>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.basic.loading,
  predictionDailyLoading: state.stockReducer.predictionDaily.loading,
  predictionDailyError: state.stockReducer.predictionDaily.error,
  error: state.stockReducer.basic.error,
  company: state.stockReducer.basic.data.fundamentals.stock_name,
  priceDataDaily: state.stockReducer.basic.data.data,
  priceDataIntraday: state.stockReducer.basic.data.data_intraday,
  predictionDaily: state.stockReducer.predictionDaily.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getStockBasic: (payload: getStockBasicParams) =>
      dispatch(stockActions.getStockBasic(payload)),
    getPredictionDaily: (payload: getPredictionDailyParams) =>
      dispatch(stockActions.getPredictionDaily(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockPage);
