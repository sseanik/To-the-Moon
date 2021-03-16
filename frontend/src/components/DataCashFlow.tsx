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
formatMap.set('operatingcashflow', {name: "Operating Cash Flow"});
formatMap.set('paymentsforoperatingactivities', {name: "Payments for Operating Activities"});
formatMap.set('operatingcashflow', {name: "Operating Cash Flow"});
formatMap.set('changeinoperatingliabilities', {name: "Change in Operating Liabilities"});
formatMap.set('changeinoperatingassets', {name: "Change in Operating Assets"});
formatMap.set('depreciationdepletionandamortization', {name: "Depreciation Depletion and Amortisation"});
formatMap.set('changeininventory', {name: "Change in Inventory"});
formatMap.set('cashflowfrominvestment', {name: "Cash Flow from Investment"});
formatMap.set('cashflowfromfinancing', {name: "Cash Flow from Financing"});
formatMap.set('dividendpayout', {name: "Dividend Payout"});
formatMap.set('proceedsfromrepurchaseofequity', {name: "Proceeds From Repurchase Of Equity"});
formatMap.set('changeincashandcashequivalents', {name: "Change in Cash"});
formatMap.set('netincome', {name: "Net Income"});

const DataCashFlow: React.FC<Props> = (props) => {
  var { cashFlow } = props;

  return (
    <Container>
    <Row>
      {cashFlow.map((entry) => (
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

export default DataCashFlow;
