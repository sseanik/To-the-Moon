import React from "react";

import {
      Container,
      Table,
      Row,
      Col
    } from "react-bootstrap";

interface BalanceSheetEntry {
  fiscaldateending: string;
  total_assets: number;
  total_curr_assets: number;
  total_ncurr_assets: number;
  total_liabilities: number;
  total_curr_liabilities: number;
  total_ncurr_liabilities: number;
  total_equity: number;
}

interface Props {
  balanceSheet: Array<BalanceSheetEntry>;
}

var formatMap = {
  fiscaldateending: {name: "Year Ending"},
  total_assets: {name: "Total Assets"},
  total_curr_assets: {name: "Total Current Assets"},
  total_ncurr_assets: {name: "Total Non-Current Assets"},
  total_liabilities: {name: "Total Liabilities"},
  total_curr_liabilities: {name: "Total Current Liabilities"},
  total_ncurr_liabilities: {name: "Total Non-Current Liabilities"},
  total_equity: {name: "Total Equity"},
}; 

const DataBalanceSheet: React.FC<Props> = (props) => {
  var { balanceSheet } = props;

  return (
    <Container>
    <Row>
      {balanceSheet.map((entry) => (
        <Col>
          <hr />
          {Object.entries(entry).map(([field, value]) => (
            <div>
              <Row lg={6}>
                <Col className="text-left" lg={6}>
                  <span>
                    <b>{formatMap[field].name}</b>
                  </span>
                </Col>
                <Col className="text-right" lg={6}>
                  <span>
                    {typeof value === "string" ? value : value / 1000}
                  </span>
                </Col>
              </Row>
              <hr />
            </div>
          ))}
        </Col>
      ))}
    </Row>
    </Container>
  );
}

export default DataBalanceSheet;
