import { Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import ClipLoader from "react-spinners/ClipLoader";
import ParentComment from "./ParentComment";
import { useEffect } from "react";
import AddCommentForm from "./AddCommentForm";

interface CommentParams {
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
  replies: ReplyParams[];
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

interface StateProps {
  getCommentsLoading: boolean;
  comments: Array<CommentParams>;
}

interface DispatchProps {
  getComments: (stockTicker: string) => void;
}

interface Props {
  stockTicker: string;
}

const Forum: React.FC<StateProps & DispatchProps & Props> = (props) => {
  const { getCommentsLoading, comments, getComments, stockTicker } = props;

  useEffect(() => {
    getComments(stockTicker);
  }, [getComments, stockTicker]);

  return (
    <Container fluid>
      <Row>
        <h2>Forum</h2>
      </Row>
      <Row className="my-2">
        <AddCommentForm stockTicker={stockTicker} />
      </Row>
      <Row className="my-2">
        {getCommentsLoading ? (
          <ClipLoader color={"green"} loading={getCommentsLoading} />
        ) : (
          comments.map((commentProps: CommentParams, idx) => {
            return <ParentComment key={idx} {...commentProps} />;
          })
        )}
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  getCommentsLoading: state.forumReducer.getComments.loading,
  comments: state.forumReducer.comments,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getComments: (stockTicker: string) =>
      dispatch(forumActions.getComments(stockTicker)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Forum);
