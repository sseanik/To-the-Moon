import React from "react";
import { Container, Row, Image } from "react-bootstrap";

interface Props {
  // declare props types here
}

const StockPage: React.FC<Props> = () => {
  return (
    <Container>
      <Row className="justify-content-center">

      </Row>
      <Row className="justify-content-center mt-2">
        <h1>Welcome To The Stock Page!</h1>
      </Row>
    </Container>
  );
}

export default StockPage;
