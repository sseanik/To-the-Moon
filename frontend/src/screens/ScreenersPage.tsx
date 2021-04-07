import { Container, Row } from "react-bootstrap";
import { SearchStockForm } from "../components";

const ScreenersPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Screeners</h1>
      </Row>
      <Row className="justify-content-center">
        <span>Screeners go here</span>
      </Row>
    </Container>
  );
}

export default ScreenersPage;
