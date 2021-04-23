import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { AddDashboardContainer, DashboardContainer } from "../components";
import dashboardActions from "../redux/actions/dashboardActions";

interface StateProps {
  dashboardId: string;
  loading: boolean;
}

interface DispatchProps {
  getDashboards: () => void;
}

const DashboardPage: React.FC<StateProps & DispatchProps> = (props) => {
  const { dashboardId, loading, getDashboards } = props;

  useEffect(() => {
    getDashboards();
  }, [getDashboards]);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading}></ClipLoader>
      <h5>Gathering dashboards...</h5>
    </div>
  );

  return (
    <Container fluid>
      {loading ? (
        loadingSpinnerComponent
      ) : dashboardId ? (
        <DashboardContainer />
      ) : (
        <AddDashboardContainer />
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  dashboardId: state.dashboardReducer.dashboardId,
  loading: state.dashboardReducer.getDashboards.loading,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getDashboards: () => dispatch(dashboardActions.getDashboards()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
