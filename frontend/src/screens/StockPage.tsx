import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Tabs, Tab, Button, Alert } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import stockActions from "../redux/actions/stockActions";

import {
  DataSummary,
  DataFundamentals,
  DataIncomeStatement,
  DataBalanceSheet,
  DataCashFlow,
  StockNews
} from "../components"

import RangeSelectorOptions from "../helpers/RangeSelectorOptions";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

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

interface StateProps {
  loading: boolean;
  error: string;
  company: string;
  priceDataDaily: any;
  priceDataIntraday: any;
  predictionDaily: any;
}

interface DispatchProps {
  getStockBasic: (payload: getStockBasicParams) => void;
  getPredictionDaily: (payload: getPredictionDailyParams) => void;
}

const StockPage: React.FC<StateProps & DispatchProps> = (props) => {
  const { company, loading, error, priceDataDaily, priceDataIntraday, predictionDaily, getStockBasic, getPredictionDaily, } = props;

  const params = useParams<RouteParams>();
  const symbol = params.symbol;

  const [displayIntra, setDisplayIntra] = useState<boolean>(false);
  const [graphOptions, setGraphOptions] = useState<graphOptionsT | any>({
    title: {
      text: "Share Price"
    },
    rangeSelector: RangeSelectorOptions(setDisplayIntra),
    series: [
      { data: [] }
    ]
  });

  const fetchStock = () => {
    getStockBasic({ symbol });
  }

  const fetchPredictDaily = () => {
    getPredictionDaily({ symbol });
  }

  useEffect(() => {
    fetchStock();
  }, []);

  useEffect(() => {
    if (displayIntra == true) {
      const seriesIntraList = Object.entries(priceDataIntraday).map(entry => {
        const [key, value] = entry;
        return { name: key, data: value }
      });
      setGraphOptions((graphOptions: graphOptionsT) => ({ ... graphOptions, series: seriesIntraList }));
    } else {
      console.log("Displaying daily");
      console.log(priceDataDaily);
      console.log(predictionDaily);
      const seriesDailyList = Object.entries(priceDataDaily).map(entry => {
        const [key, value] = entry;
        return { name: key, data: value }
      });
      const displaySeries = predictionDaily ? [ ... seriesDailyList, predictionDaily ] : seriesDailyList;
      setGraphOptions((graphOptions: graphOptionsT) => ({ ... graphOptions, series: displaySeries }));
    }
  }, [displayIntra, priceDataDaily, priceDataIntraday, predictionDaily]);

  const graphComponent = (
    <Container>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={graphOptions}
      />
      <Row className="justify-content-center">
        <Button variant="outline-info" onClick={fetchStock}>Refresh data</Button>
      </Row>
    </Container>
  );

  const loadingSpinnerComponent = (
    <Container>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Data ...</h5>
    </Container>
  );

  const alertComponent = (
    <Alert variant="danger">
      {error}
    </Alert>
  );

  const stockNameText =
    error
    ? `${symbol}`
    : `${company} (${symbol})`

  return (
    <Container>
      <Row className="justify-content-center mt-2">
        <h1>{ loading ? loadingSpinnerComponent : stockNameText }</h1>
      </Row>
      <Row>
        { error ? alertComponent : null }
      </Row>
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
                <Container>
                    <Row>
                        Prediction Status
                    </Row>
                    <Row>
                        Prediction Settings
                    </Row>
                    <Row>
                        <Button variant="outline-primary"
                          onClick={() => { fetchPredictDaily() }}>Predict</Button>
                    </Row>
                </Container>
              </Tab>
            </Tabs>
          </Container>
        </Col>
        <Col>
          { loading ? loadingSpinnerComponent : graphComponent }
        </Col>
      </Row>
      <Row>
        <Container>
          <Tabs
            className="justify-content-center mt-2"
            defaultActiveKey="news"
          >
            <Tab eventKey="news" title="News">
              <Row>
                <h3>{`News related to ${symbol}`}</h3>
              </Row>
              <StockNews stock={symbol} />
            </Tab>
            <Tab eventKey="other" title="Other">

            </Tab>
          </Tabs>
        </Container>
      </Row>
    </Container>
  );
}

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.basic.loading,
  error: state.stockReducer.basic.error,
  company: state.stockReducer.basic.data.fundamentals.stock_name,
  priceDataDaily: state.stockReducer.basic.data.data,
  priceDataIntraday: state.stockReducer.basic.data.data_intraday,
  predictionDaily: state.stockReducer.predictionDaily.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getStockBasic: (payload: getStockBasicParams) => dispatch(stockActions.getStockBasic(payload)),
    getPredictionDaily: (payload: getPredictionDailyParams) => dispatch(stockActions.getPredictionDaily(payload))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(StockPage);
