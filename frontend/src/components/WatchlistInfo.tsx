import { faSignInAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Row } from "react-bootstrap";

interface Props {
  watchlist_name: string;
  watchlist_id: string;
}

const WatchlistInfo: React.FC<Props> = (props) => {
  const { watchlist_name, watchlist_id } = props;
  return (
    <Col
      className="border rounded mx-1 my-2 p-4 portfolio-info bg-light"
      lg={4}
      md={6}
    >
      <h2 className="my-2">{watchlist_name}</h2>
      <Container className="w-75">
        <Row>
          <Col className="align-middle">
            <a href={`/watchlist/${watchlist_id}`}>
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