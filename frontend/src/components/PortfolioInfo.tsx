import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Container, Row, Button } from "react-bootstrap";
import DeletePortfolioButton from "./DeletePortfolioButton";
import { PortfolioPerformance } from ".";

interface Props {
  name: string;
  viewOnly?: boolean;
}

const PortfolioInfo: React.FC<Props> = (props) => {
  const { name, viewOnly = false } = props;

  return (
    <Container className="bg-dark">
      <h2 className="my-2">{name}</h2>
      <PortfolioPerformance name={name} />
      <Container fluid className="w-75">
        <Row>
          <Col className="align-middle">
            <Button className="portfolio-controls" href={`/portfolio/${name}`}>
              <FontAwesomeIcon icon={faSignInAlt} size="2x" />
            </Button>
          </Col>
          {!viewOnly ? (
            <Col>
              <DeletePortfolioButton portfolioName={name} />{" "}
            </Col>
          ) : null}
        </Row>
      </Container>
    </Container>
  );
};

export default PortfolioInfo;
