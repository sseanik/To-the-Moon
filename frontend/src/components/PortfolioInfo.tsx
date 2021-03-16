import React from "react";
import { Col } from "react-bootstrap";

interface Props {
  portfolio_name: string;
}

const PortfolioInfo: React.FC<Props> = (props) => {
  const { portfolio_name } = props;
  return (
    <Col className="border rounded mx-1 py-3 align-middle">
      <p className="m-0">{portfolio_name}</p>
      <a href={`/portfolio/${portfolio_name}`} className="stretched-link" />
    </Col>
  );
};

export default PortfolioInfo;
