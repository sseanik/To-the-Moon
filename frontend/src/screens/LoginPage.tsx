import { useEffect } from "react";
import { toast } from "react-toastify";
import { Container, Row } from "react-bootstrap";
import { LoginForm } from "../components";
import { useLocation } from "react-router";

interface LocationState {
  redirected?: boolean;
}

const LoginPage: React.FC = () => {
  const location = useLocation<LocationState>();
  const redirected = location.state?.redirected;

  useEffect(() => {
    if (redirected) {
      toast.info("Log in to access all content  ⬆️");
    }
  });

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
};

export default LoginPage;
