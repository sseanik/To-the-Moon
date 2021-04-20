import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  NoteRelevant,
  PaperTradeController,
} from "../components";

import RangeSelectorOptions from "../helpers/RangeSelectorOptions";
import {
  statusBadgeModifier,
  statusBadgeText,
} from "../helpers/StatusFormatModifiers";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Forum from "../components/Forum";
require("highcharts/modules/annotations")(Highcharts);

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
  predictionType: string;
}

interface durChoiceParams {
  [key: string]: { dur: number; display: string; units: string };
}

interface predictionModeParams {
  [key: string]: { idtype: string; name: string };
}

interface StateProps {
  loading: boolean;
  error: string;
  company: string;
  priceDataDaily: any;
  priceDataIntraday: any;
  predictionDaily: any;
  paperTradingResults: any;

  predictionDailyLoading: any;
  predictionDailyError: any;
  paperTradingLoading: any;
  paperTradingError: any;
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
    paperTradingResults,
    getStockBasic,
    getPredictionDaily,
    predictionDailyLoading,
    predictionDailyError,
  } = props;

  const chartComponent = useRef<any | null>(null);
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

  const predictOpts: predictionModeParams = useMemo(() => {
    return {
      lstm_wlf: { idtype: "walk_forward", name: "Vanilla LSTM (Walk-Forward)" },
      lstm_ser: { idtype: "multistep_series", name: "Vanilla LSTM (Series)" },
      lcnn_wlf: { idtype: "cnn", name: "CNN-LSTM (Walk-Forward)" },
    };
  }, []);

  const [displayIntra, setDisplayIntra] = useState<boolean>(false);
  const [graphOptions, setGraphOptions] = useState<graphOptionsT | any>({
    title: {
      text: "Share Price",
    },
    rangeSelector: RangeSelectorOptions(setDisplayIntra),
    series: [{ data: [] }],
    legend: { enabled: true, layout: "horizontal" },
  });
  const [durChoice, setdurChoice] = useState<string>("durMonths3");
  const [preChoice, setPreChoice] = useState<string>("lstm_wlf");

  const fetchStock = useCallback(() => {
    getStockBasic({ symbol });
  }, [getStockBasic, symbol]);

  const fetchPredictDaily = () => {
    const predictionType = predictOpts[preChoice].idtype;
    getPredictionDaily({ symbol, predictionType });
  };

  // TODO: predefined reset length
  const resetZoom = () => {
    if (
      chartComponent &&
      chartComponent.current &&
      graphOptions.series[0].data
    ) {
      const seriesLimit = graphOptions.series[0].data.length;
      const lower = graphOptions.series[0].data[seriesLimit - 60 - 1][0];
      const upper = graphOptions.series[0].data[seriesLimit - 1][0];
      chartComponent.current.chart.xAxis[0].setExtremes(lower, upper);
    }
  };

  const makePlotFlags = (orderList: Array<any>, orderType: string) => {
    let result: Array<any> = [];
    for (let i = 0; i < orderList.length; i++) {
      const order = orderList[i];
      if (order["type"] === orderType) {
        let flag = {
          x: order["time"],
          // y: order['price'],
          title: `${order["type"]}`,
          text: `${order["name"]} ${order["type"]} of ${order["size"]}`,
        };
        result.push(flag);
      }
    }
    return result;
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
        return { name: key, id: key, data: value };
      });
      let predictions = JSON.parse(JSON.stringify(predictionDaily));
      if (predictions.data) {
        predictions.data = predictions.data.slice(0, durOpts[durChoice].dur);
      }

      let papertrades = JSON.parse(JSON.stringify(paperTradingResults));
      let indicator = papertrades.indicator
        ? { name: "Strategy Indicator", data: papertrades.indicator }
        : null;
      let papertradeData = papertrades.orders ? papertrades.orders : null;

      let displaySeries = predictions
        ? [...seriesDailyList, predictions]
        : seriesDailyList;
      displaySeries = indicator ? [...displaySeries, indicator] : displaySeries;

      if (papertradeData) {
        let buyOrders = makePlotFlags(papertradeData, "Buy");
        let buyFlags = {
          type: "flags",
          name: "Buy orders",
          data: buyOrders,
          onSeries: "4. close",
          shape: "squarepin",
          width: 40,
        };
        let sellOrders = makePlotFlags(papertradeData, "Sell");
        let sellFlags = {
          type: "flags",
          name: "Sell orders",
          y: 30,
          data: sellOrders,
          onSeries: "4. close",
          shape: "circlepin",
          width: 40,
        };
        displaySeries = [...displaySeries, buyFlags, sellFlags];
      }

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
    paperTradingResults,
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
      <span className="sr-only">Loading Data ...</span>
    </Container>
  );

  const alertComponent = <Alert variant="danger">{error}</Alert>;

  const stockNameText =
    error || loading ? `${symbol}` : `${company} (${symbol})`;

  const predictionControlComponent = (
    <Container className="generic-container-scrolling">
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Prediction Status: </Col>
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
        <Col className="text-left font-weight-bold">Duration: </Col>
        <Col>
          <DropdownButton
            variant="outline-dark"
            id="dropdown-basic-button"
            title={durOpts[durChoice].display + " " + durOpts[durChoice].units}
          >
            {Object.entries(durOpts).map((entry, idx) => {
              const [key, value] = entry;

              return (
                <Dropdown.Item
                  key={idx}
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
        <Col className="text-left font-weight-bold">Model: </Col>
        <Col>
          <DropdownButton
            variant="outline-dark"
            id="dropdown-basic-button"
            title={predictOpts[preChoice].name}
          >
            {Object.entries(predictOpts).map((entry, idx) => {
              const [key, value] = entry;

              return (
                <Dropdown.Item
                  key={idx}
                  href="#/action-1"
                  onClick={() => {
                    setPreChoice(key);
                  }}
                >
                  {value.name}
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
        <h1>{stockNameText}</h1>
        {loadingSpinnerComponent}
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
              <Tab eventKey="paperTrading" title="Paper Trading">
                <PaperTradeController symbol={symbol} />
              </Tab>
            </Tabs>
          </Container>
        </Col>
        <Col>{loading ? loadingSpinnerComponent : graphComponent}</Col>
      </Row>
      <Row>
        <Container>
          <Tabs className="justify-content-center mt-2" defaultActiveKey="news">
            <Tab eventKey="news" title="News">
              <Row>
                <h2>{`News related to ${symbol.toUpperCase()}`}</h2>
              </Row>
              <StockNews stock={symbol} />
            </Tab>
            <Tab eventKey="forum" title="Forum">
              <Row className="justify-content-start my-2">
                <Forum stockTicker={symbol} />
              </Row>
            </Tab>
            <Tab eventKey="notes" title="Relevant Notes">
              <Row>
                <NoteRelevant stock={[symbol]} />
              </Row>
            </Tab>
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
  paperTradingResults: state.stockReducer.paperTradingResults.data,
  paperTradingLoading: state.stockReducer.paperTradingResults.loading,
  paperTradingError: state.stockReducer.paperTradingResults.error,
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
