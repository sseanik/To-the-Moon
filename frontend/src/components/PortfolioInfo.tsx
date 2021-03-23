import React from "react";
import { Button, Col } from "react-bootstrap";

interface Props {
  portfolioName: string;
}

const PortfolioInfo: React.FC<Props> = (props) => {
  const { portfolioName } = props;
  return (
    <Col className="border rounded mx-1 p-4 align-middle">
      <h2 className="my-1">{portfolioName}</h2>
      <Button className="my-1" variant="danger">
        Delete
      </Button>
      <a href={`/portfolio/${portfolioName}`} className="stretched-link">
        <span className="sr-only">Portfolio Link</span>
      </a>
    </Col>
  );
};

export default PortfolioInfo;
