import React from "react";

import {
          Container,
          Table,
          Row,
          Col
        } from "react-bootstrap";

export interface fundamentalDataT {
    company_name: string;
    exchange: string;
    currency: string;
    year_high: number;
    year_low: number;
    market_cap: number;
    beta: number;
    pe_ratio: number;
    eps: number;
    dividend_yield: number;
}

export const defaultFundamentalData = {
  company_name: "",
  exchange: "",
  currency: "",
  year_high: 0,
  year_low: 0,
  market_cap: 0,
  beta: 0,
  pe_ratio: 0,
  eps: 0,
  dividend_yield: 0,
}

interface Props {
  fundamentalData: fundamentalDataT;
}

var formatMap = new Map();
formatMap.set('stockname', {name: "Company Name"});
formatMap.set('exchange', {name: "Exchange"});
formatMap.set('currency', {name: "Currency"});
formatMap.set('yearlylow', {name: "Year Low"});
formatMap.set('yearlyhigh', {name: "Year High"});
formatMap.set('marketcap', {name: "Market Capitalisation"});
formatMap.set('beta', {name: "Beta"});
formatMap.set('peratio', {name: "PE Ratio"});
formatMap.set('eps', {name: "EPS"});
formatMap.set('dividendyield', {name: "Dividend Yield"});

const DataFundamentals: React.FC<Props> = (props) => {
  var { fundamentalData } = props;
  console.log(fundamentalData);
  return (
    <Container>
    <Row>
      <Col>
        <hr />
        {Object.entries(fundamentalData).map(([field, value]) => (
          <div>
            <Row lg={6}>
              <Col className="text-left" lg={6}>
                <span>
                  <b>{formatMap.get(field) ? formatMap.get(field).name : field}</b>
                </span>
              </Col>
              <Col className="text-right" lg={6}>
                <span>
                  {value}
                </span>
              </Col>
            </Row>
            <hr />
          </div>
        ))}
      </Col>
    </Row>
    </Container>
  );
}

export default DataFundamentals;
