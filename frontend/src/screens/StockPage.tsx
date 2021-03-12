import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Link, Route, useParams, useRouteMatch } from "react-router-dom";
import {  Container,
          Row,
          Image,
          Table
        } from "react-bootstrap";

// import { render } from 'react-dom';
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import { getStockData } from "../redux/actions/userActions";

interface Props {
  // declare props types here
}

interface graphOptionsT {
  title: { text: string };
  series: Array<{ name: string, data: Array<Array<number>> }>;
}

interface summaryDataT {
    previous_close: number;
    open: number;
    day_min: number;
    day_max: number;
    year_min: number;
    year_max: number;
    volume: number;
    average_volume: number;
}

const StockPage: React.FC<Props> = () => {
  var { url } = useRouteMatch();
  console.log(url);

  return (
    <BrowserRouter>
      <Container fluid className="app-container justify-content-center">
        <Switch>
          <Route path={`${url}/:symbol`} component={StockDisp} />
          <Route path={`${url}`} component={StockDisp} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

const StockDisp: React.FC<Props> = (props) => {
  var { symbol } = useParams<{ symbol: string }>();

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
  const [summaryData, setSummaryData] = useState<summaryDataT>({
    previous_close: 0,
    open: 0,
    day_min: 0,
    day_max: 0,
    year_min: 0,
    year_max: 0,
    volume: 0,
    average_volume: 0,
  });

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
      console.log(stockdata.summary);
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
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={graphOptions}
          />
        </div>
      </Row>

      <Row className="justify-content-center mt-2">
        <Table striped>
          <tbody>
            <tr>
              <th>Previous Close</th>
              <td>{summaryData.previous_close ? summaryData.previous_close : "N/A"}</td>
            </tr>
            <tr>
              <th>Open</th>
              <td>{summaryData.open ? summaryData.open : "N/A"}</td>
            </tr>
            <tr>
              <th>Day Range</th>
              <td>{summaryData.day_min ? summaryData.day_min : "N/A"}
              - {summaryData.day_max ? summaryData.day_max : "N/A"}</td>
            </tr>
            <tr>
              <th>52 Week Range</th>
              <td>{summaryData.year_min ? summaryData.year_min : "N/A"}
              - {summaryData.year_max ? summaryData.year_max : "N/A"}</td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>{summaryData.volume ? summaryData.volume : "N/A"}</td>
            </tr>
            <tr>
              <th>Average Volume</th>
              <td>{summaryData.average_volume
                  ? summaryData.average_volume.toFixed(0) : "N/A"}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default StockPage;
