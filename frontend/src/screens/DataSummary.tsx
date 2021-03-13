import React from "react";

import {
          Container,
          Table
        } from "react-bootstrap";


export interface summaryDataT {
    previous_close: number;
    open: number;
    day_min: number;
    day_max: number;
    year_min: number;
    year_max: number;
    volume: number;
    average_volume: number;
}

interface Props {
  summaryData: summaryDataT;
}

const DataSummary: React.FC<Props> = (props) => {
  var { summaryData } = props;

  return (
    <Container>
      <Table className="text-left" responsive="sm">
        <tbody>
          <tr>
            <th>Previous Close</th>
            <td>{summaryData.previous_close ? summaryData.previous_close : "N/A"}</td>
          </tr>
          <tr>
            <th>Open</th>
            <td>{summaryData.open ? summaryData.open : "N/A"}</td>
          </tr>
          <tr>
            <th>Day Range</th>
            <td>{summaryData.day_min ? summaryData.day_min : "N/A"}
            - {summaryData.day_max ? summaryData.day_max : "N/A"}</td>
          </tr>
          <tr>
            <th>52 Week Range</th>
            <td>{summaryData.year_min ? summaryData.year_min : "N/A"}
            - {summaryData.year_max ? summaryData.year_max : "N/A"}</td>
          </tr>
          <tr>
            <th>Volume</th>
            <td>{summaryData.volume ? summaryData.volume : "N/A"}</td>
          </tr>
          <tr>
            <th>Average Volume</th>
            <td>{summaryData.average_volume
                ? summaryData.average_volume.toFixed(0) : "N/A"}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default DataSummary;
