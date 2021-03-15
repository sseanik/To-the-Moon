import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Link, Route, useParams, useRouteMatch } from "react-router-dom";
import {  Container,
          Row,
          Col,
          Tabs,
          Tab
        } from "react-bootstrap";

import DataSummary, { summaryDataT, defaultSummaryData } from "../components/DataSummary";
import DataFundamentals, { fundamentalDataT, defaultFundamentalData } from "../components/DataFundamentals";
import DataIncomeStatement from "../components/DataIncomeStatement";
import DataBalanceSheet from "../components/DataBalanceSheet";
import DataCashFlow from "../components/DataCashFlow";

// import { render } from 'react-dom';
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import Actions from "../redux/actions/stock";

interface Props {
  // declare props types here
}

interface graphOptionsT {
  title: { text: string };
  series: Array<{ name: string, data: Array<Array<number>> }>;
}

const StockPage: React.FC<Props> = (props) => {
  var routeMatch = useRouteMatch();
  var symbol = routeMatch.params.symbol;

  const [genkey, setGenkey] = useState('summary');
  const [finkey, setFinkey] = useState('incomestatement');

  const [displayIntra, setDisplayIntra] = useState<boolean>(false);
  const [graphOptions, setGraphOptions] = useState<graphOptionsT | any>({
    title: {
      text: ""
    },
    rangeSelector: {
        allButtonsEnabled: true,
        selected: undefined,
        buttons: [
        {
            type: 'day',
            count: 1,
            text: '1d',
            title: 'View 1 day',
            events: {
                click: function () {
                    setDisplayIntra(true);
                }
            }
        }, {
            type: 'week',
            count: 1,
            text: '1w',
            title: 'View 1 week',
            events: {
                click: function () {
                    setDisplayIntra(true);
                }
            }
        }, {
            type: 'month',
            count: 1,
            text: '1m',
            title: 'View 1 month',
            events: {
                click: function () {
                    setDisplayIntra(false);
                }
            }
        }, {
            type: 'month',
            count: 3,
            text: '3m',
            title: 'View 3 months',
            events: {
                click: function () {
                    setDisplayIntra(false);
                }
            }
        }, {
            type: 'month',
            count: 6,
            text: '6m',
            title: 'View 6 months',
            events: {
                click: function () {
                    setDisplayIntra(false);
                }
            }
        }, {
            type: 'ytd',
            text: 'YTD',
            title: 'View year to date',
            events: {
                click: function () {
                    setDisplayIntra(false);
                }
            }
        }, {
            type: 'year',
            count: 1,
            text: '1y',
            title: 'View 1 year',
            events: {
                click: function () {
                    setDisplayIntra(false);
                }
            }
        }, {
            type: 'year',
            count: 5,
            text: '5y',
            title: 'View 5 year',
            events: {
                click: function () {
                    setDisplayIntra(false);
                }
            }
        }, {
            type: 'all',
            text: 'All',
            title: 'View all'
        }]
    },
    series: [
      {
        data: [

        ]
      }
    ]
  });
  const [incomeStatement, setIncomeStatement] = useState<any>([]);
  const [balanceSheet, setBalanceSheet] = useState<any>([]);
  const [cashFlow, setCashFlow] = useState<any>([]);
  const [summaryData, setSummaryData] = useState<summaryDataT>(defaultSummaryData);
  const [fundamentalData, setFundamentalData] = useState<fundamentalDataT>(defaultFundamentalData);
  const [timeSeriesDaily, setTimeSeriesDaily] = useState<any>([]);
  const [timeSeriesIntra, setTimeSeriesIntra] = useState<any>([]);

  useEffect(() => {
    async function fetchStock() {
      var stockdata = symbol ? await Actions.getStockData(symbol) : {};
      // console.log(symbol);
      // console.log(stockdata);
      if (!stockdata) { return; }
      var seriesDailyList = [];
      var seriesIntraList = [];

      if (stockdata.data) {
          for (let [key, value] of Object.entries(stockdata.data)) {
            seriesDailyList.push({name: key, data: value});
          }
          setTimeSeriesDaily(seriesDailyList);
      }
      if (stockdata.data_intraday) {
          for (let [key, value] of Object.entries(stockdata.data_intraday)) {
            seriesIntraList.push({name: key, data: value});
          }
          setTimeSeriesIntra(seriesIntraList);
      }
      if (stockdata.summary) setSummaryData(stockdata.summary);
      if (stockdata.fundamentals) setFundamentalData(stockdata.fundamentals);
    }

    fetchStock();
  }, []);

  useEffect(() => {
      if (displayIntra == true) {
          setGraphOptions({ ... graphOptions, series: timeSeriesIntra });
      } else {
          setGraphOptions({ ... graphOptions, series: timeSeriesDaily });
      }
  }, [displayIntra, timeSeriesDaily, timeSeriesIntra]);

  useEffect(() => {
      if (genkey === "financials") {
        if ((finkey === "incomestatement") && (incomeStatement.length === 0)) {
          fetchIncomeStatement();
        } else if ((finkey === "balancesheet") && (balanceSheet.length === 0)) {
          fetchBalanceSheet();
        } else if ((finkey === "cashflow") && (cashFlow.length === 0)) {
          fetchCashFlow();
        }
      }
  }, [genkey, finkey]);

  const fetchIncomeStatement = () => {
    async function fetchIncome() {
      var incomedata = symbol ? await Actions.getIncomeStatement(symbol) : {};
      if (incomedata.data) {
        setIncomeStatement(incomedata.data);
      }
    }
    fetchIncome();
  }

  const fetchBalanceSheet = () => {
    async function fetchBalance() {
      var balancedata = symbol ? await Actions.getBalanceSheet(symbol) : {};
      if (balancedata.data) {
        setBalanceSheet(balancedata.data);
      }
    }
    fetchBalance();
  }

  const fetchCashFlow = () => {
    async function fetchCash() {
      var cashdata = symbol ? await Actions.getCashFlow(symbol) : {};
      if (cashdata.data) {
        setCashFlow(cashdata.data);
      }
    }
    fetchCash();
  }

  return (
    <Container>
      <Row className="justify-content-center">

      </Row>
      <Row className="justify-content-center mt-2">
        <h1>Welcome To The Stock Page!</h1>
      </Row>

      <Row className="justify-content-center">
        <Col>
          <div>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={'stockChart'}
              options={graphOptions}
            />
          </div>
        </Col>
        <Col>
          <Container>
            <Tabs
              className="justify-content-center mt-2"
              defaultActiveKey="summary"
              id="sec-view-info-selector"
              activeKey={genkey}
              onSelect={(k) => { setGenkey(k); }}
            >
              <Tab eventKey="summary" title="Summary">
                <DataSummary summaryData={summaryData} />
              </Tab>
              <Tab eventKey="statistics" title="Statistics">
                <DataFundamentals fundamentalData={fundamentalData} />
              </Tab>

              <Tab eventKey="financials" title="Financials">
                  <Tabs
                    className="justify-content-center mt-2"
                    defaultActiveKey="incomestatement"
                    id="sec-view-financials"
                    activeKey={finkey}
                    onSelect={(k) => { setFinkey(k); }}
                  >
                      <Tab eventKey="incomestatement" title="Income Statement">
                        <DataIncomeStatement incomeStatement={incomeStatement}/>
                      </Tab>
                      <Tab eventKey="balancesheet" title="Balance Sheet">
                        <DataBalanceSheet balanceSheet={balanceSheet}/>
                      </Tab>
                      <Tab eventKey="cashflow" title="Cash Flow Statement">
                        <DataCashFlow cashFlow={cashFlow}/>
                      </Tab>
                  </Tabs>
              </Tab>
            </Tabs>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default StockPage;
