import React from "react";
import { Container, Row, Image } from "react-bootstrap";
import { RouteComponentProps, useParams, useRouteMatch } from "react-router";
import logo from "../resources/shuttle.png";

interface Props {
  // declare
}

interface RouteMatchParams {
  id: string;
}

const PortfolioPage: React.FC<Props> = () => {
  const { id } = useParams<RouteMatchParams>();
  
  // pass token to backend
  // retrieve userID
  return (
    <Container>
      <Row className="justify-content-center">Hello {id}</Row>
    </Container>
  );
};

export default PortfolioPage;
