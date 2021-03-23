import { Container, Row } from "react-bootstrap";
import { SearchStockForm } from "../components";

const SearchStockPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Stocks</h1>
      </Row>
      <Row className="justify-content-center">
        <SearchStockForm />
      </Row>
    </Container>
  );
}

export default SearchStockPage;