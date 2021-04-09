import { Button, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { useState } from "react";
import DeleteChildButton from "./DeleteChildButton";
import EditChildForm from "./EditChildForm";

interface StateProps {
  currentUsername: string;
}

interface Props {
  comment_id: string;
  reply_id: string;
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
}

const ChildComment: React.FC<StateProps & Props> = (props) => {
  const {
    currentUsername,
    comment_id,
    reply_id,
    username,
    time_stamp,
    content,
    is_edited,
    is_deleted,
    is_upvoted,
    is_downvoted,
    vote_difference,
  } = props;

  const [editing, setEditing] = useState(false);

  return (
    <Row className="my-1 w-100">
      <Container fluid className="border rounded pt-2 ml-5">
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
        <Row className="justify-content-start mb-1 align-items-center">
          <Col md={1}>
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={is_upvoted ? "text-success" : ""}
            />
          </Col>
          <Col md={1}>
            <p
              className={
                vote_difference >= 0 ? "text-success m-0" : "text-danger m-0"
              }
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
          {currentUsername === username ? (
            editing ? (
              <Col md={1}>
                <Button variant="light" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </Col>
            ) : (
              <Col md={1}>
                <Button variant="light" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              </Col>
            )
          ) : null}
          {currentUsername === username ? (
            <Col md={1}>
              <DeleteChildButton commentID={reply_id} parentID={comment_id} />
            </Col>
          ) : null}
        </Row>
      </Container>
      <Container fluid>
        {editing ? (
          <EditChildForm commentID={reply_id} parentID={comment_id} />
        ) : null}
      </Container>
    </Row>
  );
};

const mapStateToProps = (state: any) => ({
  currentUsername: state.userReducer.username,
});

export default connect(mapStateToProps)(ChildComment);
