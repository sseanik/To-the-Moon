import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import DeleteWatchlistButton from "./DeleteWatchlistButton";

interface StateProps {
  username: string;
}

interface Props {
  watchlist_name: string;
  watchlist_id: string;
  author_username: string;
}

const WatchlistInfo: React.FC<StateProps & Props> = (props) => {
  const { username, watchlist_name, watchlist_id, author_username } = props;
  return (
    <Col
      className="border rounded mx-1 my-2 p-4 watchlist-info bg-light"
      lg={4}
      md={6}
    >
      <h2 className="my-2">{watchlist_name}</h2>
      <Container fluid className="w-75">
        <Row>
          <Col className="align-middle">
            <Button
              className="watchlist-controls"
              href={`/watchlist/${watchlist_id}`}
            >
              <FontAwesomeIcon icon={faInfo} size="2x" />
            </Button>
          </Col>
          {username === author_username ? (
            <Col>
              <DeleteWatchlistButton watchlistID={watchlist_id} />
            </Col>
          ) : null}
        </Row>
      </Container>
    </Col>
  );
};

const mapStateToProps = (state: any) => ({
  username: state.userReducer.username,
});

export default connect(mapStateToProps)(WatchlistInfo);
