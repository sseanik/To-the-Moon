import React from "react";

import {
          Container,
          Table
        } from "react-bootstrap";

interface Props {

}

const DataIncomeStatement: React.FC<Props> = (props) => {
  var { incomeStatement } = props;

  return (
    <Container>
      <Table className="text-left" responsive="sm">
        <tbody>
          <tr>
            <th>Fiscal Year Ending</th>
            <td>{incomeStatement.fiscaldateending ? incomeStatement.fiscaldateending : "N/A"}</td>
          </tr>
          <tr>
            <th>Total Revenue</th>
            <td>{incomeStatement.totalrevenue ? incomeStatement.totalrevenue : "N/A"}</td>
          </tr>
          <tr>
            <th>Cost of Revenue</th>
            <td>{incomeStatement.costofrevenue ? incomeStatement.costofrevenue : "N/A"}</td>
          </tr>
          <tr>
            <th>Gross Profit</th>
            <td>{incomeStatement.grossprofit ? incomeStatement.grossprofit : "N/A"}</td>
          </tr>
          <tr>
            <th>Operating Expenses</th>
            <td>{incomeStatement.operatingexpenses ? incomeStatement.operatingexpenses : "N/A"}</td>
          </tr>
          <tr>
            <th>Operating Income</th>
            <td>{incomeStatement.operatingincome ? incomeStatement.operatingincome : "N/A"}</td>
          </tr>
          <tr>
            <th>Income Before Tax</th>
            <td>{incomeStatement.incomebeforetax ? incomeStatement.incomebeforetax : "N/A"}</td>
          </tr>
          <tr>
            <th>Interest Income</th>
            <td>{incomeStatement.interestincome ? incomeStatement.interestincome : "N/A"}</td>
          </tr>
          <tr>
            <th>Net Interest Income</th>
            <td>{incomeStatement.netinterestincome ? incomeStatement.netinterestincome : "N/A"}</td>
          </tr>
          <tr>
            <th>EBIT</th>
            <td>{incomeStatement.ebit ? incomeStatement.ebit : "N/A"}</td>
          </tr>
          <tr>
            <th>EBITDA</th>
            <td>{incomeStatement.ebitda ? incomeStatement.ebitda : "N/A"}</td>
          </tr>
          <tr>
            <th>Net Income</th>
            <td>{incomeStatement.netincome ? incomeStatement.netincome : "N/A"}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default DataIncomeStatement;
