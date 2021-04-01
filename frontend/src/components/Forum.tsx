import { Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import ClipLoader from "react-spinners/ClipLoader";
import Comment from "./Comment";
import { useEffect } from "react";
import AddParentForm from "./AddParentForm";

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
  replies?: Array<string>;
  parent_id?: string;
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
        {getCommentsLoading ? (
          <ClipLoader color={"green"} loading={getCommentsLoading} />
        ) : (
          comments.map((commentProps: CommentParams, idx) => {
            return <Comment key={idx} {...commentProps}></Comment>;
          })
        )}
      </Row>
      <Row className="my-2">
        <AddParentForm stockTicker={stockTicker} />
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
