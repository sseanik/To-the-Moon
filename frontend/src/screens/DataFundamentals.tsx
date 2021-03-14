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
            <td>{fundamentalData.company_name ? fundamentalData.company_name : "N/A"}</td>
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
            <td>{fundamentalData.year_low ? fundamentalData.year_low : "N/A"}</td>
          </tr>
          <tr>
            <th>Year High</th>
            <td>{fundamentalData.year_high ? fundamentalData.year_high : "N/A"}</td>
          </tr>
          <tr>
            <th>Market Cap</th>
            <td>{fundamentalData.market_cap ? fundamentalData.market_cap : "N/A"}</td>
          </tr>
          <tr>
            <th>Beta</th>
            <td>{fundamentalData.beta ? fundamentalData.beta : "N/A"}</td>
          </tr>
          <tr>
            <th>PE Ratio</th>
            <td>{fundamentalData.pe_ratio ? fundamentalData.pe_ratio : "N/A"}</td>
          </tr>
          <tr>
            <th>EPS</th>
            <td>{fundamentalData.eps ? fundamentalData.eps : "N/A"}</td>
          </tr>
          <tr>
            <th>Dividend Yield</th>
            <td>{fundamentalData.dividend_yield ? fundamentalData.dividend_yield : "N/A"}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default DataFundamentals;
