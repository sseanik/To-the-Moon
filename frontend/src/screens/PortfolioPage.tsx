import React from "react";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router";

interface Props {
  // declare
}

interface RouteMatchParams {
  name: string;
}

const PortfolioPage: React.FC<Props> = () => {
  const { name } = useParams<RouteMatchParams>();

  // pass token to backend
  // retrieve userID
  return (
    <Container>
      <Row className="justify-content-center">Hello {name}</Row>
    </Container>
  );
};

export default PortfolioPage;
