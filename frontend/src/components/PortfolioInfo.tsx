import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Container, Row, Button } from "react-bootstrap";
import DeletePortfolioButton from "./DeletePortfolioButton";
import { PortfolioPerformance } from ".";

interface Props {
  name: string;
}

const PortfolioInfo: React.FC<Props> = (props) => {
  const { name } = props;

  return (
    <Col
      className="border rounded mx-1 p-4 portfolio-info bg-light"
      lg={4}
      md={6}
    >
      <h2 className="my-2">{name}</h2>
      <PortfolioPerformance name={name} />
      <Container fluid className="w-75">
        <Row>
          <Col className="align-middle">
            <Button className="portfolio-controls" href={`/portfolio/${name}`}>
              <FontAwesomeIcon icon={faSignInAlt} size="2x" />
            </Button>
          </Col>
          <Col>
            <DeletePortfolioButton portfolioName={name} />
          </Col>
        </Row>
      </Container>
    </Col>
  );
};

export default PortfolioInfo;
