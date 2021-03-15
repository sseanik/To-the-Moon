import React from "react";
import { Container, Row } from "react-bootstrap";
import { RegisterForm } from "../components";

const SignupPage: React.FC = () => {
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