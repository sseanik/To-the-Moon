import { useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { BlocksContainer } from ".";
import dashboardActions from "../redux/actions/dashboardActions";

interface StateProps {
  dashboardId: string;
  loading: boolean;
  error: string;
}

interface DispatchProps {
  getBlocks: (payload: GetBlocksParams) => void;
}

interface GetBlocksParams {
  dashboardId: string;
}

const DashboardContainer: React.FC<StateProps & DispatchProps> = (props) => {
  const { dashboardId, loading, error, getBlocks } = props;

  useEffect(() => {
    if (dashboardId) {
      getBlocks({ dashboardId });
    }
  }, [dashboardId, getBlocks]);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading}></ClipLoader>
      <h5>Gathering blocks...</h5>
    </div>
  );

  return (
    <Container fluid>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading ? loadingSpinnerComponent : null}
      <BlocksContainer />
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  dashboardId: state.dashboardReducer.dashboardId,
  loading: state.dashboardReducer.getBlocks.loading,
  error: state.dashboardReducer.getBlocks.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getBlocks: (payload: GetBlocksParams) =>
      dispatch(dashboardActions.getBlocks(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
