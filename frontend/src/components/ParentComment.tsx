import { Button, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import AddChildForm from "./AddChildForm";
import { useState } from "react";
import ChildComment from "./ChildComment";
import EditParentForm from "./EditParentForm";
import { connect } from "react-redux";

interface StateProps {
  currentUsername: string;
}

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
  replies: Array<ReplyParams>;
}

interface ReplyParams {
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

const ParentComment: React.FC<StateProps & Props> = (props) => {
  const {
    currentUsername,
    comment_id,
    stock_ticker,
    username,
    time_stamp,
    content,
    is_edited,
    is_deleted,
    is_upvoted,
    is_downvoted,
    vote_difference,
    replies,
  } = props;

  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <Row className="my-1 w-100">
      <Container fluid className="border border-secondary rounded pt-2">
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
            <Col md={2}>
              <p className="text-muted">
                {new Date(time_stamp).toLocaleDateString()}
              </p>
            </Col>
            {is_edited ? (
              <Col md={1}>
                <p className="text-muted">(edited)</p>
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
          {replying ? (
            <Col md={1}>
              <Button variant="light" onClick={() => setReplying(false)}>
                Cancel
              </Button>
            </Col>
          ) : (
            <Col md={1}>
              <Button variant="light" onClick={() => setReplying(true)}>
                Reply
              </Button>
            </Col>
          )}
          {/* {currentUsername === username ? (
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
          ) : null} */}
          {editing ? (
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
          )}
        </Row>
      </Container>
      <Container fluid>
        {replying ? (
          <AddChildForm stockTicker={stock_ticker} parentID={comment_id} />
        ) : null}
      </Container>
      <Container fluid>
        {editing ? <EditParentForm commentID={comment_id} /> : null}
      </Container>
      {replies.map((replyProps: ReplyParams, idx: number) => {
        return <ChildComment key={idx} {...replyProps} />;
      })}
    </Row>
  );
};

const mapStateToProps = (state: any) => ({
  currentUsername: state.userReducer.username,
});

export default connect(mapStateToProps)(ParentComment);
