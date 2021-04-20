import { Alert, Button, Container } from "react-bootstrap";
import { connect } from "react-redux";
import portfolioActions from "../redux/actions/portfolioActions";
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DeletePortfolioParams {
  portfolioName: string;
}

interface Props {
  portfolioName: string;
}

interface StateProps {
  error: Object;
  deleting: Array<string>;
}

interface DispatchProps {
  deletePortfolio: (payload: DeletePortfolioParams) => void;
}

const DeletePortfolioButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { error, deleting, deletePortfolio, portfolioName } = props;
  const deleteButton = (
    <Button
      className="portfolio-controls"
      variant="danger"
      onClick={() => deletePortfolio({ portfolioName })}
    >
      <FontAwesomeIcon icon={faTrash} />
    </Button>
  );

  return (
    <Container fluid className="deleteButton">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {deleting.includes(portfolioName) ? (
        <ClipLoader
          color={"green"}
          loading={deleting.includes(portfolioName)}
        />
      ) : (
        deleteButton
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
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
