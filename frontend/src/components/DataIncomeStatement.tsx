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

interface IncomeStatementEntry {
  stockticker: string;
  fiscaldateending: string;
  totalrevenue: string;
  costofrevenue: string;
  grossprofit: string;
  operatingexpenses: string;
  operatingincome: string;
  incomebeforetax: string;
  interestincome: string;
  netinterestincome: string;
  ebit: string;
  ebitda: string;
  netincome: string;
}

interface Props {
  incomeStatement: Array<IncomeStatementEntry>;
}

const formatMap: IObjectKeys = {
  stockticker: {name: "Company Symbol"},
  fiscaldateending: {name: "Year Ending"},
  totalrevenue: {name: "Total Revenue"},
  costofrevenue: {name: "Cost of Revenue"},
  grossprofit: {name: "Gross Profit"},
  operatingexpenses: {name: "Operating Expenses"},
  operatingincome: {name: "Operating Income"},
  incomebeforetax: {name: "Income Before Tax"},
  interestincome: {name: "Interest Income"},
  netinterestincome: {name: "Net Interest Income"},
  ebit: {name: "EBIT"},
  ebitda: {name: "EBITDA"},
  netincome: {name: "Net Income"},
}; 

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

export default DataIncomeStatement;
