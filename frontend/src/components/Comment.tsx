import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

interface Props {
  comment_id: string;
  stock_ticker: string;
  username: string;
  time_stamp: number;
  content: string;
  is_edited: boolean;
  is_deleted: boolean;
  is_upvoted: boolean;
  is_downvoted: boolean;
  upvotes: number;
  downvotes: number;
  vote_difference: number;
  replies?: Array<string>;
  parent_id?: string;
}

const Comment: React.FC<Props> = (props) => {
  const {
    username,
    time_stamp,
    content,
    is_edited,
    is_deleted,
    is_upvoted,
    is_downvoted,
    vote_difference,
    parent_id,
  } = props;

  return (
    <Row className="my-1 w-100">
      <Container
        fluid
        className={`border rounded pt-2 ${parent_id ? "pl-5" : ""}`}
      >
        {is_deleted ? (
          <Row>
            <Col md={2}>
              <p className="font-weight-bold text-left">Deleted</p>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={2}>
              <p className="font-weight-bold text-left">{username}</p>
            </Col>
            <Col md={1}>
              <p className="text-muted">
                {new Date(time_stamp).toLocaleDateString()}
              </p>
            </Col>
            {is_edited ? (
              <Col md={1}>
                <p className="text-muted">edited</p>
              </Col>
            ) : null}
          </Row>
        )}
        <Row>
          <Col>
            <p className="text-left">{is_deleted ? "Deleted" : content}</p>
          </Col>
        </Row>
        <Row className="justify-content-start">
          <Col md={1}>
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={is_upvoted ? "text-success" : ""}
            />
          </Col>
          <Col md={1}>
            <p
              className={vote_difference >= 0 ? "text-success" : "text-danger"}
            >
              {vote_difference}
            </p>
          </Col>
          <Col md={1}>
            <FontAwesomeIcon
              icon={faThumbsDown}
              className={is_downvoted ? "text-danger" : ""}
            />
          </Col>
        </Row>
      </Container>
    </Row>
  );
};

export default Comment;
