import React from "react";
import { Container, Row, Image } from "react-bootstrap";
import { RegisterForm } from "../components";
import logo from "../resources/shuttle.png";

interface Props {
  // declare props types here
}

const SignupPage: React.FC<Props> = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <h2>Sign up 🚀</h2>
      </Row>
      <Row className="justify-content-center">
        <RegisterForm />
      </Row>
    </Container>
  );
}

export default SignupPage;