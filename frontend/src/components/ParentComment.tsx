import { Button, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faWindowClose,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ChildComment from "./ChildComment";
import { connect } from "react-redux";
import EditCommentForm from "./EditCommentForm";
import DeleteCommentButton from "./DeleteCommentButton";
import AddCommentForm from "./AddCommentForm";
import UpvoteCommentButton from "./UpvoteCommentButton";
import DownvoteCommentButton from "./DownvoteCommentButton";

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
  const [numReplies, setNumReplies] = useState(0);

  return (
    <Row className="my-1 w-100">
      <Container fluid className="border border-secondary rounded pt-2 bg-dark">
        {is_deleted ? (
          <Row>
            <Col md={2}>
              <p className="font-weight-bold text-left">[Deleted]</p>
            </Col>
          </Row>
        ) : (
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
        )}
        <Row>
          <Col>
            <p className="text-left">{is_deleted ? "[Deleted]" : content}</p>
          </Col>
        </Row>
        {is_deleted ? null : (
          <Row className="justify-content-start mb-1 align-items-center">
            <Col md={1}>
              <UpvoteCommentButton
                commentID={comment_id}
                isUpvoted={is_upvoted}
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
              <DownvoteCommentButton
                commentID={comment_id}
                isDownvoted={is_downvoted}
              />
            </Col>
            {replying ? (
              <Col md={1}>
                <Button variant="light" onClick={() => setReplying(false)}>
                  <FontAwesomeIcon icon={faWindowClose} />
                </Button>
              </Col>
            ) : (
              <Col md={1}>
                <Button variant="light" onClick={() => setReplying(true)}>
                  <FontAwesomeIcon icon={faReply} />
                </Button>
              </Col>
            )}
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
                <DeleteCommentButton commentID={comment_id} />
              </Col>
            ) : null}
          </Row>
        )}
      </Container>
      <Container fluid>
        {replying ? (
          <AddCommentForm stockTicker={stock_ticker} parentID={comment_id} />
        ) : null}
      </Container>
      <Container fluid>
        {editing ? <EditCommentForm commentID={comment_id} /> : null}
      </Container>
      {replies
        .slice(0, numReplies)
        .map((replyProps: ReplyParams, idx: number) => {
          return <ChildComment key={idx} {...replyProps} />;
        })}
      {replies.length === 0 ? null : numReplies === 0 ? (
        <Button
          variant="light"
          className="mt-2 mb-1"
          onClick={() => {
            setNumReplies(numReplies + 5);
          }}
        >
          View replies...
        </Button>
      ) : numReplies < replies.length ? (
        <Button
          variant="light"
          className="mt-2 mb-1 ml-5"
          onClick={() => {
            setNumReplies(numReplies + 5);
          }}
        >
          View more...
        </Button>
      ) : (
        <Button
          variant="light"
          className="mt-2 mb-1 ml-5"
          onClick={() => {
            setNumReplies(0);
          }}
        >
          Hide replies...
        </Button>
      )}
    </Row>
  );
};

const mapStateToProps = (state: any) => ({
  currentUsername: state.userReducer.username,
});

export default connect(mapStateToProps)(ParentComment);
