import React from "react";
import { Col } from "react-bootstrap";
import DeletePortfolioButton from "./DeletePortfolioButton";

interface Props {
  portfolioName: string;
}

const PortfolioInfo: React.FC<Props> = (props) => {
  const { portfolioName } = props;
  return (
    <Col className="border rounded mx-1 p-4 align-middle portfolio-info">
      <a href={`/portfolio/${portfolioName}`}>
        <h2 className="my-1">{portfolioName}</h2>
      </a>
      <DeletePortfolioButton portfolioName={portfolioName} />
    </Col>
  );
};

export default PortfolioInfo;
