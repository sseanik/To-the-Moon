import React from "react";
import { Container, Row, Image } from "react-bootstrap";
import logo from "../resources/shuttle.png";

interface Props {
  productID: string;
}

const PortfolioPage: React.FC<Props> = (props) => {
  const { productID } = props;
  return (
    <Container>
      <Row className="justify-content-center">
        <Image src={logo} />
      </Row>
    </Container>
  );
};

export default PortfolioPage;
