import React from "react";
import { Container, Row } from "react-bootstrap";
import { LoginForm } from "../components";

const LoginPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <h2>Login 🚀</h2>
      </Row>
      <Row className="justify-content-center">
        <LoginForm />
      </Row>
    </Container>
  );
}

export default LoginPage;