import { Alert, Container, Button } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import dashboardActions from "../redux/actions/dashboardActions";

interface StateProps {
  loading: boolean;
  error: string;
}

interface DispatchProps {
  createDashboard: () => void;
}

const createDashboardStyle = {
  margin: "auto",
  borderRadius: "20px",
} as React.CSSProperties;

const AddDashboardContainer: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, error, createDashboard } = props;

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading}></ClipLoader>
      <h5>Constructing rockets...</h5>
    </div>
  );

  const addDashboardButton = (
    <Button
      variant="success"
      size="lg"
      style={createDashboardStyle}
      onClick={() => createDashboard()}
    >
      Create Dashboard
    </Button>
  );

  return (
    <Container>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <h5 className="py-5 justify-content-center">
        There are no dashboards here, click the big shiny button below to add one 👀
      </h5>
      {loading
        ? loadingSpinnerComponent
        : addDashboardButton}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.dashboardReducer.createDashboard.loading,
  error: state.dashboardReducer.createDashboard.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    createDashboard: () => {
      dispatch(dashboardActions.createDashboard());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDashboardContainer);
