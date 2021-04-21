import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import stockActions from "../redux/actions/stockActions";

import RangeSelectorOptions from "../helpers/RangeSelectorOptions";
import { durationOptionsObj } from "../helpers/PredictionHelpers";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
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

interface getStockBasicParams {
  symbol: string;
}

interface durChoiceParams {
  [key: string]: { dur: number; display: string; units: string };
}

interface Props {
  stock?: string;
}

interface StateProps {
  loading: boolean;
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
}

const graphBorderStyle = {
  border: "7px solid grey",
};

const StockGraph: React.FC<Props & StateProps & DispatchProps> = (props) => {
  const {
    stock,
    loading,
    priceDataDaily,
    priceDataIntraday,
    predictionDaily,
    paperTradingResults,
    getStockBasic,
  } = props;

  const chartComponent = useRef<any | null>(null);
  const symbol = stock ? stock : "";

  const durOpts: durChoiceParams = useMemo(() => {
    return durationOptionsObj;
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
  const [durChoice] = useState<string>("durMonths3");

  const fetchStock = useCallback(() => {
    if (symbol) {
      getStockBasic({ symbol });
    }
  }, [getStockBasic, symbol]);

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
      <div style={graphBorderStyle} className="dashboard-stock-graph">
        <HighchartsReact
          ref={chartComponent}
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={graphOptions}
        />
      </div>
      <Row className="py-1 justify-content-around">
        <Col>
          <Button variant="info" onClick={fetchStock}>
            Refresh data
          </Button>
        </Col>
        <Col>
          <Button variant="info" onClick={resetZoom}>
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

  return (
    <Container>
      <h5>{stock}</h5>
      <Row>{loading ? loadingSpinnerComponent : graphComponent}</Row>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.basic.loading,
  predictionDailyLoading: state.stockReducer.predictionDaily.loading,
  predictionDailyError: state.stockReducer.predictionDaily.error,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockGraph);
