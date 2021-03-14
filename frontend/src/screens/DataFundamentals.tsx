import React from "react";

import {
          Container,
          Table
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

const DataFundamentals: React.FC<Props> = (props) => {
  var { fundamentalData } = props;

  return (
    <Container>
      <Table className="text-left" responsive="sm">
        <tbody>
          <tr>
            <th>Company Name</th>
            <td>{fundamentalData.stockname ? fundamentalData.stockname : "N/A"}</td>
          </tr>
          <tr>
            <th>Exchange</th>
            <td>{fundamentalData.exchange ? fundamentalData.exchange : "N/A"}</td>
          </tr>
          <tr>
            <th>Currency</th>
            <td>{fundamentalData.currency ? fundamentalData.currency : "N/A"}</td>
          </tr>
          <tr>
            <th>Year Low</th>
            <td>{fundamentalData.yearlylow ? fundamentalData.yearlylow : "N/A"}</td>
          </tr>
          <tr>
            <th>Year High</th>
            <td>{fundamentalData.yearlyhigh ? fundamentalData.yearlyhigh : "N/A"}</td>
          </tr>
          <tr>
            <th>Market Cap</th>
            <td>{fundamentalData.marketcap ? fundamentalData.marketcap : "N/A"}</td>
          </tr>
          <tr>
            <th>Beta</th>
            <td>{fundamentalData.beta ? fundamentalData.beta : "N/A"}</td>
          </tr>
          <tr>
            <th>PE Ratio</th>
            <td>{fundamentalData.peratio ? fundamentalData.peratio : "N/A"}</td>
          </tr>
          <tr>
            <th>EPS</th>
            <td>{fundamentalData.eps ? fundamentalData.eps : "N/A"}</td>
          </tr>
          <tr>
            <th>Dividend Yield</th>
            <td>{fundamentalData.dividendyield ? fundamentalData.dividendyield : "N/A"}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default DataFundamentals;
