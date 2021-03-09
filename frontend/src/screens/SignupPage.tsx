import React from "react";
import { Container, Row, Image } from "react-bootstrap";
import logo from "../resources/shuttle.png";

interface Props {
  // declare props types here
}

const SignupPage: React.FC<Props> = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Image src={logo} />
      </Row>
      <Row className="justify-content-center mt-2">
        <h1>Welcome To The Moon!</h1>
      </Row>
    </Container>
  );
}

export default SignupPage;