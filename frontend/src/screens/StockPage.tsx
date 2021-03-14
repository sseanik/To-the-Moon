import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Link, Route, useParams, useRouteMatch } from "react-router-dom";
import {  Container,
          Row,
          Col,
          Tabs,
          Tab
        } from "react-bootstrap";

import DataSummary, { summaryDataT, defaultSummaryData } from "./DataSummary";
import DataFundamentals, { fundamentalDataT, defaultFundamentalData } from "./DataFundamentals";

// import { render } from 'react-dom';
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import { getStockData } from "../redux/actions/stock";

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
  const [summaryData, setSummaryData] = useState<summaryDataT>(defaultSummaryData);
  const [fundamentalData, setFundamentalData] = useState<fundamentalDataT>(defaultFundamentalData);
  const [timeSeriesDaily, setTimeSeriesDaily] = useState<any>([]);
  const [timeSeriesIntra, setTimeSeriesIntra] = useState<any>([]);

  useEffect(() => {
    async function fetchStock() {
      var stockdata = symbol ? await getStockData(symbol)
        : await getStockData("");
      // console.log(symbol);
      // console.log(stockdata);
      if (!stockdata) { return; }
      var seriesDailyList = [];
      var seriesIntraList = [];

      for (let [key, value] of Object.entries(stockdata.data)) {
        seriesDailyList.push({name: key, data: value});
      }
      for (let [key, value] of Object.entries(stockdata.data_intraday)) {
        seriesIntraList.push({name: key, data: value});
      }
      setTimeSeriesDaily(seriesDailyList);
      setTimeSeriesIntra(seriesIntraList);
      // setGraphOptions({ ... graphOptions, series: seriesDailyList });
      setSummaryData(stockdata.summary);
      setFundamentalData(stockdata.fundamentals);
      console.log(stockdata.fundamentals);
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
            >
              <Tab eventKey="summary" title="Summary">
                <DataSummary summaryData={summaryData} />
              </Tab>
              <Tab eventKey="statistics" title="Statistics">
                <DataFundamentals fundamentalData={fundamentalData} />
              </Tab>
              <Tab eventKey="financials" title="Financials">
                <h1> Financials Table </h1>
              </Tab>
            </Tabs>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default StockPage;
