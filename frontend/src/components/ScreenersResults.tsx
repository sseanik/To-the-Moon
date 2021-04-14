import { Container, Col, Row, Alert, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import screenerActions from "../redux/actions/screenerActions";

interface getScreenerResultsParams {
  name: string,
  parameters: any,
}

interface Props {

}

interface StateProps {
  loading: boolean;
  data: Array<any>;
  error: string;
}

interface DispatchProps {
  // getScreenerResults: (payload: getScreenerResultsParams);
}

const ScreenersResults: React.FC<Props & StateProps & DispatchProps> = (
  props
) => {
  const { loading, error, data } = props;

  // useEffect(() => {
  //   console.log("Screener data: ", data);
  // }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Results</h1>
      </Row>
      <hr />
      <Row>
        <Col>Symbol</Col>
        <Col>Price</Col>
        <Col>Price Change</Col>
        <Col>Price Change (%)</Col>
        <Col>Volume</Col>
        <Col>Market Cap</Col>
        <Col>PE Ratio</Col>
      </Row>
      <hr />
      <Row>
        {data.map((entry: any, idx) => (
          Object.entries(entry).map(([field, value], idx) => (
            <Col>{`${value}`}</Col>
          ))
        ))}
        <hr />
      </Row>
    </Container>
  );
}

const mapStateToProps = (state: any) => ({
  loading: state.screenerReducer.results.loading,
  error: state.screenerReducer.results.error,
  data: state.screenerReducer.results.data,
});

const mapDispatchToProps = (state: any) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenersResults);
