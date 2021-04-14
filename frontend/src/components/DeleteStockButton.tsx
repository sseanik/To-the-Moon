import { Alert, Button, Container } from "react-bootstrap";
import { connect } from "react-redux";
import investmentActions from "../redux/actions/investmentActions";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DeleteStockParams {
  investmentID: string;
  portfolioName: string;
}

interface StateProps {
  loading: boolean;
  error: Object;
  deleting: Array<string>;
}

interface DispatchProps {
  deleteStock: (payload: DeleteStockParams) => void;
}

interface Props {
  investmentID: string;
}

interface RouteMatchParams {
  name: string;
}

const DeleteStockButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { name: portfolioName } = useParams<RouteMatchParams>();
  const { loading, error, deleting, deleteStock, investmentID } = props;

  return (
    <Container fluid>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading && deleting.includes(investmentID) ? (
        <ClipLoader color={"green"} loading={loading} />
      ) : (
        <Button
          variant="danger"
          className="my-1"
          onClick={() => deleteStock({ investmentID, portfolioName })}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.investmentReducer.deleteStock.loading,
  error: state.investmentReducer.deleteStock.error,
  deleting: state.investmentReducer.deleteStock.deleting,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteStock: (payload: DeleteStockParams) => {
      dispatch(investmentActions.deleteStock(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteStockButton);
