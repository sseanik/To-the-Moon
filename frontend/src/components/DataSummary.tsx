import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

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
  isLoading: boolean;
}

const formatMap: IObjectKeys = {
  previous_close: {name: "Previous Close"},
  open: {name: "Open"},
  day_min: {name: "Daily Low"},
  day_max: {name: "Daily High"},
  year_min: {name: "Yearly Low"},
  year_max: {name: "Yearly High"},
  volume: {name: "Volume"},
  average_volume: {name: "Average Volume"},
};

const DataSummary: React.FC<Props> = (props) => {
  const { summaryData, isLoading } = props;

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={isLoading} />
      <h5>Loading Data ...</h5>
    </div>
  );

  const tableComponent = (
    <Container>
    <Row>
      <Col>
        <hr />
        {Object.entries(summaryData).map(([field, value]) => (
          <div>
            <Row lg={6}>
              <Col className="text-left" lg={6}>
                <span>
                  <b>{formatMap[field] ? formatMap[field].name : field}</b>
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

  return isLoading ? loadingSpinnerComponent : tableComponent;
}

export default DataSummary;
