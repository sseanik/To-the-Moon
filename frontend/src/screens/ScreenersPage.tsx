import { Container, Row } from "react-bootstrap";
import { ScreenersQueryForm } from "../components";
import { ScreenersResults } from "../components";
import { ScreenerList } from "../components";

const ScreenersPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Screeners</h1>
      </Row>
      <Row className="justify-content-center">
        <ScreenersQueryForm />
      </Row>
      <Row className="justify-content-center">
        <ScreenersResults />
      </Row>
      <Row className="justify-content-center">
        <ScreenerList />
      </Row>
    </Container>
  );
}

export default ScreenersPage;
