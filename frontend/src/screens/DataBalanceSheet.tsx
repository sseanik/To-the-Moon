import React from "react";

import {
      Container,
      Table,
      Row,
      Col
    } from "react-bootstrap";

interface Props {

}

var formatMap = new Map();
formatMap.set('fiscaldateending', {name: "Year Ending"});
formatMap.set('total_assets', {name: "Total Assets"});
formatMap.set('total_curr_assets', {name: "Total Current Assets"});
formatMap.set('total_ncurr_assets', {name: "Total Non-Current Assets"});
formatMap.set('total_liabilities', {name: "Total Liabilities"});
formatMap.set('total_curr_liabilities', {name: "Total Current Liabilities"});
formatMap.set('total_ncurr_liabilities', {name: "Total Non-Current Liabilities"});
formatMap.set('total_equity', {name: "Total Equity"});

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
                    <b>{formatMap.get(field).name}</b>
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
