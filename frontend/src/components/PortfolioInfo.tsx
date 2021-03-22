import React from "react";
import { Col } from "react-bootstrap";

interface Props {
  portfolioName: string;
}

const PortfolioInfo: React.FC<Props> = (props) => {
  const { portfolioName } = props;
  return (
    <Col className="border rounded mx-1 p-5 align-middle">
      <p className="m-0">{portfolioName}</p>
      <a href={`/portfolio/${portfolioName}`} className="stretched-link" />
    </Col>
  );
};

export default PortfolioInfo;
