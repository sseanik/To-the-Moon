import { faSignInAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Row } from "react-bootstrap";

interface Props {
  watchlistName: string;
  watchlistID: string;
}

const WatchlistInfo: React.FC<Props> = (props) => {
  const { watchlistName, watchlistID } = props;
  return (
    <Col
      className="border rounded mx-1 p-4 portfolio-info bg-light"
      lg={4}
      md={6}
    >
      <h2 className="my-2">{watchlistName}</h2>
      <Container className="w-75">
        <Row>
          <Col className="align-middle">
            <a href={`/portfolio/${watchlistID}`}>
              <FontAwesomeIcon icon={faSignInAlt} size="2x" />
            </a>
          </Col>
          <Col>
            <Button variant="danger">
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Col>
        </Row>
      </Container>
    </Col>
  );
};

export default WatchlistInfo;
