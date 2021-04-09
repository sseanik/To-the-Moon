import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import DeletePortfolioButton from "./DeletePortfolioButton";

interface Props {
  portfolioName: string;
}

const PortfolioInfo: React.FC<Props> = (props) => {
  const { portfolioName } = props;
  return (
    <Col className="border rounded mx-1 p-4 portfolio-info" md={3}>
      <h2 className="my-2">{portfolioName}</h2>
      <Container className="w-50">
        <Row>
          <Col className="align-middle">
            <a href={`/portfolio/${portfolioName}`}>
              <FontAwesomeIcon icon={faSignInAlt} size="2x" />
            </a>
          </Col>
          <Col>
            <DeletePortfolioButton portfolioName={portfolioName} />
          </Col>
        </Row>
      </Container>
    </Col>
  );
};

export default PortfolioInfo;
