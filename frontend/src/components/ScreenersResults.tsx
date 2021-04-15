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
        <Col className="text-center" lg={1}>Symbol</Col>
        <Col className="text-center" lg={2}>Price</Col>
        <Col className="text-center" lg={1}>Price Change</Col>
        <Col className="text-center" lg={2}>Price Change (%)</Col>
        <Col className="text-center" lg={2}>Volume</Col>
        <Col className="text-center" lg={2}>Market Cap</Col>
        <Col className="text-center" lg={2}>PE Ratio</Col>
      </Row>
      <hr />
        {data.map((entry: any, idx) => (
          <Row>
            <Col className="text-center" lg={1}><a href={`/stock/${entry['stock ticker']}`}>{entry['stock ticker']}</a></Col>
            <Col className="text-right" lg={2}>{entry['price']}</Col>
            <Col className="text-right" lg={1}>{entry['price change']}</Col>
            <Col className="text-right" lg={2}>{(Number(entry['price change percentage'])*100).toFixed(4)}</Col>
            <Col className="text-right" lg={2}>{entry['volume']}</Col>
            <Col className="text-right" lg={2}>{entry['market capitalization']}</Col>
            <Col className="text-right" lg={2}>{entry['PE ratio']}</Col>
            <hr />
          </Row>
        ))}
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
