import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Row } from "react-bootstrap";
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
      className="border rounded mx-1 my-2 p-4 portfolio-info bg-dark"
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
