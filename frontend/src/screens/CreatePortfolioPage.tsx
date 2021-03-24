import { Container, Row } from "react-bootstrap";
import { CreatePortfolioForm } from "../components";

const CreatePortfolioPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <h2>Create a Portfolio 🚀</h2>
      </Row>
      <Row className="justify-content-center">
        <CreatePortfolioForm />
      </Row>
    </Container>
  );
};

export default CreatePortfolioPage;
