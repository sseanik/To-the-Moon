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
formatMap.set('stockticker', {name: "Company Symbol"});
formatMap.set('fiscaldateending', {name: "Year Ending"});
formatMap.set('totalrevenue', {name: "Total Revenue"});
formatMap.set('costofrevenue', {name: "Cost of Revenue"});
formatMap.set('grossprofit', {name: "Gross Profit"});
formatMap.set('operatingexpenses', {name: "Operating Expenses"});
formatMap.set('operatingincome', {name: "Operating Income"});
formatMap.set('incomebeforetax', {name: "Income Before Tax"});
formatMap.set('interestincome', {name: "Interest Income"});
formatMap.set('netinterestincome', {name: "Net Interest Income"});
formatMap.set('ebit', {name: "EBIT"});
formatMap.set('ebitda', {name: "EBITDA"});
formatMap.set('netincome', {name: "Net Income"});

const DataIncomeStatement: React.FC<Props> = (props) => {
  var { incomeStatement } = props;

  return (
    <Container>
    <Row>
      {incomeStatement.map((entry) => (
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

export default DataIncomeStatement;
