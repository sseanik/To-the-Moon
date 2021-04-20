import { useState } from "react";
import { Col, Alert, Container, Button } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import dashboardActions from "../redux/actions/dashboardActions";

interface StateProps {
  dashboardId: string;
  loading: boolean;
  error: string;
}

interface DispatchProps {
  createBlock: (payload: CreateBlockParams) => void;
}

interface CreateBlockParams {
  dashboardId: string;
  type: string;
  meta: { [key: string]: any };
}

interface CreateBlockFormValues

const createBlockStyle = {
  margin: "auto",
  borderRadius: "20px",
  boxShadow: "5px 10px 18px #888888",
} as React.CSSProperties;

const AddBlockComponent: React.FC<StateProps & DispatchProps> = (props) => {
  const { dashboardId, loading, error, createBlock } = props;
  const [showForm, setShowForm] = useState(false);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading}></ClipLoader>
      <h5>Building block...</h5>
    </div>
  );

  const formComponent = (
    <Container>
      {showForm ? (
        <div>
          <Button
            variant="danger"
            size="lg"
            style={createBlockStyle}
            onClick={() => setShowForm(!showForm)}
          >
            Close
          </Button>
        </div>
      ) : (
        <Button
          variant="success"
          size="lg"
          style={createBlockStyle}
          onClick={() => setShowForm(!showForm)}
        >
          Add Block
        </Button>
      )}
    </Container>
  );

  return (
    <Col className="border rounded mx-1 p-4 bg-light justify-content-center align-items-center">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading ? loadingSpinnerComponent : null}
      {formComponent}
    </Col>
  );
};

const mapStateToProps = (state: any) => ({
  dashboardId: state.dashboardReducer.dashboardId,
  loading: state.dashboardReducer.createBlock.loading,
  error: state.dashboardReducer.createBlock.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    createBlock: (payload: CreateBlockParams) =>
      dispatch(dashboardActions.createBlock(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBlockComponent);
