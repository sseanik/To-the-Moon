import React from "react";

import {
          Container,
          Table,
          Row,
          Col
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

export const defaultSummaryData = {
  previous_close: 0,
  open: 0,
  day_min: 0,
  day_max: 0,
  year_min: 0,
  year_max: 0,
  volume: 0,
  average_volume: 0,
}

interface Props {
  summaryData: summaryDataT;
}

var formatMap = new Map();
formatMap.set('previous_close', {name: "Previous Close"});
formatMap.set('open', {name: "Open"});
formatMap.set('day_min', {name: "Daily Low"});
formatMap.set('day_max', {name: "Daily High"});
formatMap.set('year_min', {name: "Yearly Low"});
formatMap.set('year_max', {name: "Yearly High"});
formatMap.set('volume', {name: "Volume"});
formatMap.set('average_volume', {name: "Average Volume"});

const DataSummary: React.FC<Props> = (props) => {
  var { summaryData } = props;

  return (
    <Container>
    <Row>
      <Col>
        <hr />
        {Object.entries(summaryData).map(([field, value]) => (
          <div>
            <Row lg={6}>
              <Col className="text-left" lg={6}>
                <span>
                  <b>{formatMap.get(field) ? formatMap.get(field).name : field}</b>
                </span>
              </Col>
              <Col className="text-right" lg={6}>
                <span>
                  {value}
                </span>
              </Col>
            </Row>
            <hr />
          </div>
        ))}
      </Col>
    </Row>
    </Container>
  );
}

export default DataSummary;
