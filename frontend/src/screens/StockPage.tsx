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

  const [graphOptions, setGraphOptions] = useState<graphOptionsT | any>({
    title: {
      text: ""
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

  useEffect(() => {
    async function fetchStock() {
      var stockdata = symbol ? await getStockData(symbol)
        : await getStockData("");
      // console.log(symbol);
      // console.log(stockdata);
      if (!stockdata) { return; }
      var seriesList = [];

      for (let [key, value] of Object.entries(stockdata.data)) {
        seriesList.push({name: key, data: value});
      }
      setGraphOptions({ ... graphOptions, series: seriesList });
      setSummaryData(stockdata.summary);
      setFundamentalData(stockdata.fundamentals);
      console.log(stockdata.fundamentals);
    }

    fetchStock();
  }, []);

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
