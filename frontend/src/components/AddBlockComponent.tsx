import { useState } from "react";
import { Col, Row, Alert, Container, Button, Tab, Nav } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { AddPortfolioBlockForm } from ".";

interface StateProps {
  loading: boolean;
  error: string;
}

const createBlockStyle = {
  margin: "auto",
  borderRadius: "20px",
} as React.CSSProperties;

const AddBlockComponent: React.FC<StateProps> = (props) => {
  const { loading, error } = props;
  const [showForm, setShowForm] = useState(false);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading}></ClipLoader>
      <h5>Building block...</h5>
    </div>
  );

  const formComponent = (
    <Container>
      <Button
        variant="danger"
        size="lg"
        style={createBlockStyle}
        className="mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        Close
      </Button>
      <Tab.Container defaultActiveKey="Portfolio">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="Portfolio">Portfolio</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="News">News</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="Portfolio">
                <h4>Add a Portfolio Block</h4>
                <AddPortfolioBlockForm />
              </Tab.Pane>
              <Tab.Pane eventKey="News">
                <h4>Add a News Block</h4>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );

  const addBlockButton = (
    <Button
      variant="success"
      size="lg"
      style={createBlockStyle}
      onClick={() => setShowForm(!showForm)}
    >
      Add Block
    </Button>
  );

  return (
    <Col className="border rounded mx-1 p-4 bg-light justify-content-center align-items-center">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading ? loadingSpinnerComponent : null}
      {showForm ? formComponent : addBlockButton}
    </Col>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.dashboardReducer.createBlock.loading,
  error: state.dashboardReducer.createBlock.error,
});

export default connect(mapStateToProps)(AddBlockComponent);
