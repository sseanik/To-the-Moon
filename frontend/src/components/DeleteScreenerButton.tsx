import { Button, Container } from "react-bootstrap";
import { connect } from "react-redux";
import screenerActions from "../redux/actions/screenerActions";
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DeleteScreenerParams {
  name: string;
}

interface StateProps {
  loading: boolean;
  deleting: Array<string>;
}

interface DispatchProps {
  deleteScreener: (payload: DeleteScreenerParams) => void;
}

interface Props {
  name: string;
}

const DeleteScreenerButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { loading, deleting, deleteScreener, name } = props;

  return (
    <Container fluid>
      {loading && deleting.includes(name) ? (
        <ClipLoader color={"green"} loading={loading} />
      ) : (
        <Button
          variant="danger"
          className="my-1"
          onClick={() => deleteScreener({ name })}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.screenerReducer.deletion.loading,
  deleting: state.screenerReducer.deletion.deleting,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteScreener: (payload: DeleteScreenerParams) => {
      dispatch(screenerActions.deleteScreener(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteScreenerButton);
