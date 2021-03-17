import React from "react";

import {
  Container,
  Row,
  Col
} from "react-bootstrap";

interface IObjectKeys {
  [key: string]: AttributeValues;
}

interface AttributeValues {
  name: string;
}

interface CashFlowEntry {
  stockticker: string;
  fiscaldateending: string;
  operatingcashflow: string;
  paymentsforoperatingactivities: string;
  changeinoperatingliabilities: string;
  changeinoperatingassets: string;
  depreciationdepletionandamortization: string;
  changeininventory: string;
  cashflowfrominvestment: string;
  cashflowfromfinancing: string;
  dividendpayout: string;
  proceedsfromrepurchaseofequity: string;
  changeincashandcashequivalents: string;
  netincome: string;
}

interface Props {
  cashFlow: Array<CashFlowEntry>;
}

const formatMap: IObjectKeys = {
  stockticker: {name: "Company Symbol"},
  fiscaldateending: {name: "Year Ending"},
  paymentsforoperatingactivities: {name: "Payments for Operating Activities"},
  operatingcashflow: {name: "Operating Cash Flow"},
  changeinoperatingliabilities: {name: "Change in Operating Liabilities"},
  changeinoperatingassets: {name: "Change in Operating Assets"},
  depreciationdepletionandamortization: {name: "Depreciation Depletion and Amortisation"},
  changeininventory: {name: "Change in Inventory"},
  cashflowfrominvestment: {name: "Cash Flow from Investment"},
  cashflowfromfinancing: {name: "Cash Flow from Financing"},
  dividendpayout: {name: "Dividend Payout"},
  proceedsfromrepurchaseofequity: {name: "Proceeds From Repurchase Of Equity"},
  changeincashandcashequivalents: {name: "Change in Cash"},
  netincome: {name: "Net Income"},
}; 

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

export default DataCashFlow;