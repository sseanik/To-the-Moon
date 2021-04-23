import { Button, Container } from "react-bootstrap";
import { connect } from "react-redux";
import portfolioActions from "../redux/actions/portfolioActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DeletePortfolioParams {
  portfolioName: string;
}

interface Props {
  portfolioName: string;
}

interface StateProps {
  deleting: Array<string>;
}

interface DispatchProps {
  deletePortfolio: (payload: DeletePortfolioParams) => void;
}

const DeletePortfolioButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { deleting, deletePortfolio, portfolioName } = props;

  return (
    <Container fluid className="deleteButton">
      <Button
        className="portfolio-controls"
        variant="danger"
        disabled={deleting.includes(portfolioName)}
        onClick={() => deletePortfolio({ portfolioName })}
      >
        <FontAwesomeIcon icon={faTrash} size="2x" />
      </Button>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
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
