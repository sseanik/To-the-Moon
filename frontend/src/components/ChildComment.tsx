import { Button, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { useState } from "react";
import { DeleteCommentButton, EditCommentForm, VoteCommentButton } from ".";

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

  return is_deleted ? null : (
    <Row className="my-1 w-100">
      <Container fluid className="border rounded pt-2 ml-5 bg-dark">
        <Row className="mb-2">
          <Col md={2}>
            <p className="font-weight-bold text-left d-inline mr-2">
              {username}
            </p>
            <p className="text-muted d-inline mx-1">
              {new Date(time_stamp).toLocaleDateString()}
            </p>
            {is_edited ? (
              <p className="text-muted d-inline mx-1">(edited)</p>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="text-left">{content}</p>
          </Col>
        </Row>
        <Row className="justify-content-start mb-1 align-items-center">
          <Col md={1}>
            <VoteCommentButton
              commentID={reply_id}
              parentID={comment_id}
              isUpvoted={is_upvoted}
              isDownvoted={is_downvoted}
              voteType="upvote"
            />
          </Col>
          <Col md={1}>
            <p
              className={
                vote_difference > 0
                  ? "text-success m-0"
                  : vote_difference < 0
                  ? "text-danger m-0"
                  : "m-0"
              }
            >
              {vote_difference}
            </p>
          </Col>
          <Col md={1}>
            <VoteCommentButton
              commentID={reply_id}
              parentID={comment_id}
              isUpvoted={is_upvoted}
              isDownvoted={is_downvoted}
              voteType="downvote"
            />
          </Col>
          {currentUsername === username ? (
            editing ? (
              <Col md={1}>
                <Button variant="light" onClick={() => setEditing(false)}>
                  <FontAwesomeIcon icon={faWindowClose} />
                </Button>
              </Col>
            ) : (
              <Col md={1}>
                <Button variant="light" onClick={() => setEditing(true)}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </Col>
            )
          ) : null}
          {currentUsername === username ? (
            <Col md={1}>
              <DeleteCommentButton commentID={reply_id} parentID={comment_id} />
            </Col>
          ) : null}
        </Row>
      </Container>
      <Container fluid>
        {editing ? (
          <EditCommentForm commentID={reply_id} parentID={comment_id} />
        ) : null}
      </Container>
    </Row>
  );
};

const mapStateToProps = (state: any) => ({
  currentUsername: state.userReducer.username,
});

export default connect(mapStateToProps)(ChildComment);
