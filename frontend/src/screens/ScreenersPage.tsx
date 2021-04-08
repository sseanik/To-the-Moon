import { Container, Row } from "react-bootstrap";
import { ScreenersQueryForm } from "../components";

const ScreenersPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Screeners</h1>
      </Row>
      <Row className="justify-content-center">
        <ScreenersQueryForm />
      </Row>
    </Container>
  );
}

export default ScreenersPage;
