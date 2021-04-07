import { Alert, Button, Container } from "react-bootstrap";
import { connect } from "react-redux";
import portfolioActions from "../redux/actions/portfolioActions";
import ClipLoader from "react-spinners/ClipLoader";

interface DeletePortfolioParams {
  portfolioName: string;
}

interface Props {
  portfolioName: string;
}

interface StateProps {
  loading: boolean;
  error: Object;
  deleting: Array<string>;
}

interface DispatchProps {
  deletePortfolio: (payload: DeletePortfolioParams) => void;
}

const DeletePortfolioButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { loading, error, deleting, deletePortfolio, portfolioName } = props;
  const deleteButton = (
    <Button
      variant="danger"
      onClick={() => deletePortfolio({ portfolioName })}
    >
      🗑 Delete
    </Button>
  );

  return (
    <Container fluid className="deleteButton">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading && deleting.includes(portfolioName) ? (
        <ClipLoader color={"green"} loading={loading} />
      ) : (
        deleteButton
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.portfolioReducer.deletePortfolio.loading,
  error: state.portfolioReducer.deletePortfolio.error,
  deleting: state.portfolioReducer.deletePortfolio.deleting,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    deletePortfolio: (payload: DeletePortfolioParams) => {
      dispatch(portfolioActions.deletePortfolios(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeletePortfolioButton);
