import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {  Container,
          Row,
          Col,
          Tabs,
          Tab,
          Button
        } from "react-bootstrap";

import RangeSelectorOptions from "../helpers/RangeSelectorOptions";

import DataSummary, { summaryDataT, defaultSummaryData } from "../components/DataSummary";
import DataFundamentals, { fundamentalDataT, defaultFundamentalData } from "../components/DataFundamentals";
import DataIncomeStatement from "../components/DataIncomeStatement";
import DataBalanceSheet from "../components/DataBalanceSheet";
import DataCashFlow from "../components/DataCashFlow";
import { NewsCard } from "../components";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import StockAPI from "../api/stock";
import NewsAPI from "../api/news";

interface graphOptionsT {
  title: { text: string };
  series: Array<{ name: string, data: Array<Array<number>> }>;
}

interface RouteParams {
  symbol: string;
}

const StockPage: React.FC = () => {
  var params = useParams<RouteParams>();
  var symbol = params.symbol;

  const [genkey, setGenkey] = useState<string|null>('summary');
  const [finkey, setFinkey] = useState<string|null>('incomestatement');
  const [companyName, setCompanyName] = useState('View');

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
  const [incomeStatement, setIncomeStatement] = useState<any>([]);
  const [balanceSheet, setBalanceSheet] = useState<any>([]);
  const [cashFlow, setCashFlow] = useState<any>([]);
  const [summaryData, setSummaryData] = useState<summaryDataT>(defaultSummaryData);
  const [fundamentalData, setFundamentalData] = useState<fundamentalDataT>(defaultFundamentalData);
  const [timeSeriesDaily, setTimeSeriesDaily] = useState<any>([]);
  const [timeSeriesIntra, setTimeSeriesIntra] = useState<any>([]);
  const [stockNews, setStockNews] = useState([]);

  async function fetchStock() {
    const stockdata = symbol ? await StockAPI.getBasic(symbol) : {};

    if (!stockdata) {
      return;
    }
    const seriesDailyList = [];
    const seriesIntraList = [];
    setCompanyName(stockdata.name);

    setGraphOptions({ ... graphOptions, title: {text: `Share Price`}});
    for (let [key, value] of Object.entries(stockdata.data)) {
      seriesDailyList.push({name: key, data: value});
    }
    setTimeSeriesDaily(seriesDailyList);

    for (let [key, value] of Object.entries(stockdata.data_intraday)) {
      seriesIntraList.push({name: key, data: value});
    }
    setTimeSeriesIntra(seriesIntraList);

    if (stockdata.summary) {
      setSummaryData(stockdata.summary);
    }
    if (stockdata.fundamentals) {
      setFundamentalData(stockdata.fundamentals);
    }
  }

  async function fetchNews() {
    const news = await NewsAPI.getNewsByStock(symbol)
    setStockNews(news.articles);
  }

  useEffect(() => {
    fetchStock();
    fetchNews();
  }, []);

  useEffect(() => {
    if (displayIntra == true) {
      setGraphOptions({ ... graphOptions, series: timeSeriesIntra });
    } else {
      setGraphOptions({ ... graphOptions, series: timeSeriesDaily });
    }
  }, [displayIntra, timeSeriesIntra, timeSeriesDaily]);

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
      var incomedata = symbol ? await StockAPI.getIncome(symbol) : {};
      if (incomedata) {
        setIncomeStatement(incomedata.data);
      }
    }
    fetchIncome();
  }

  const fetchBalanceSheet = () => {
    async function fetchBalance() {
      var balancedata = symbol ? await StockAPI.getBalance(symbol) : {};
      if (balancedata) {
        setBalanceSheet(balancedata.data);
      }
    }
    fetchBalance();
  }

  const fetchCashFlow = () => {
    async function fetchCash() {
      var cashdata = symbol ? await StockAPI.getCashFlow(symbol) : {};
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
        <h2>{`Company: ${companyName} (${symbol})`}</h2>
      </Row>

      <Row>
        <Col className="border text-left" sm={2} ><h4>Controls</h4></Col>
        <Col sm={1}>
          <Button variant="outline-primary"
            onClick={fetchStock}>Refresh</Button>
        </Col>
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
                <DataSummary summaryData={summaryData} isLoading={false}/>
              </Tab>
              <Tab eventKey="statistics" title="Statistics">
                <DataFundamentals fundamentalData={fundamentalData} isLoading={false}/>
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
                        <DataIncomeStatement incomeStatement={incomeStatement} isLoading={false}/>
                      </Tab>
                      <Tab eventKey="balancesheet" title="Balance Sheet">
                        <DataBalanceSheet balanceSheet={balanceSheet} isLoading={false}/>
                      </Tab>
                      <Tab eventKey="cashflow" title="Cash Flow Statement">
                        <DataCashFlow cashFlow={cashFlow} isLoading={false}/>
                      </Tab>
                  </Tabs>
              </Tab>
            </Tabs>
          </Container>
        </Col>
      </Row>
      <Row>
        <h3>{`News related to ${symbol}`}</h3>
      </Row>
      <Row>
        {
          stockNews.map((news, idx) => (
            <NewsCard key={idx} {...news} />
          ))
        }
      </Row>
    </Container>
  );
}

export default StockPage;
