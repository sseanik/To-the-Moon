import { useEffect } from "react";
import { Container, Col, Row, Alert } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import screenerActions from "../redux/actions/screenerActions";
import LoadScreenerParamsButton from "./LoadScreenerParamsButton";
import DeleteScreenerButton from "./DeleteScreenerButton";

import { ScreenerQuery, paramsObjToString } from "../helpers/ScreenerQuery";

interface screenerListParams {
  name: string;
  params: ScreenerQuery;
}

interface loadScreenersParams {}

interface Props {}

interface StateProps {
  loading: boolean;
  data: Array<any>;
  error: string;
}

interface DispatchProps {
  // deleteScreener: (payload: deleteScreenerParams);
  loadScreeners: (payload: loadScreenersParams) => void;
}

const ScreenerList: React.FC<Props & StateProps & DispatchProps> = (props) => {
  const { loading, error, data, loadScreeners } = props;

  useEffect(() => {
    loadScreeners({});
  }, [loadScreeners]);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Data ...</h5>
    </div>
  );

  const alertComponent = <Alert variant="danger">{error}</Alert>;

  const tableComponent = (
    <Container>
      <Row className="justify-content-center">
        <h1>Saved Screeners</h1>
      </Row>
      <hr />
      <Container className="py-3 bg-dark">
        <Row className="justify-content-center">
          <Col className="text-center" lg={2}>
            Name
          </Col>
          <Col className="text-center" lg={4}>
            Parameters
          </Col>
          <Col className="text-center" lg={2}>
            Options
          </Col>
        </Row>
        <hr style={{ borderTop: "1px solid white" }} />
        {error ? alertComponent : null}
        {loading
          ? loadingSpinnerComponent
          : data.map((entry: screenerListParams, idx) => (
              <Row className="justify-content-center">
                <Col className="text-center" lg={2}>
                  {entry["name"]}
                </Col>
                <Col className="text-center" lg={4}>
                  {entry["params"] ? paramsObjToString(entry["params"]) : null}
                </Col>
                <Col className="text-center" lg={2}>
                  <Row className="justify-content-center">
                    <Col lg={6}>
                      <LoadScreenerParamsButton
                        parametersObj={entry["params"]}
                      />
                    </Col>
                    <Col lg={6}>
                      <DeleteScreenerButton name={entry["name"]} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
      </Container>
    </Container>
  );

  return tableComponent;
};

const mapStateToProps = (state: any) => ({
  loading: state.screenerReducer.list.loading,
  error: state.screenerReducer.list.error,
  data: state.screenerReducer.list.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadScreeners: (payload: loadScreenersParams) => {
      dispatch(screenerActions.loadScreeners(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenerList);
