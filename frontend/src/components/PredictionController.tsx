import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Alert,
  Badge,
  Dropdown,
  DropdownButton,
  InputGroup,
  FormControl,
} from "react-bootstrap";

import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import stockActions from "../redux/actions/stockActions";

import { statusBadgeModifier, statusBadgeText } from "../helpers/StatusFormatModifiers";
import { durationOptionsObj, predictionOptionsObj } from "../helpers/PredictionHelpers";

interface getPredictionDailyParams {
  symbol: string;
  predictionType: string;
}

interface durChoiceParams {
  [key: string]: { dur: number; display: string; units: string };
}

interface predictionModeParams {
  [key: string]: { idtype: string; name: string };
}

interface Props {
  symbol: string;
  durChoice: string;
  setdurChoice: (durChoice: string) => void;
  preChoice: string;
  setPreChoice: (preChoice: string) => void;
}

interface StateProps {
  predictionDaily: any;
  predictionDailyLoading: any;
  predictionDailyError: any;
}

interface DispatchProps {
  getPredictionDaily: (payload: getPredictionDailyParams) => void;
}

const PredictionController: React.FC<StateProps & DispatchProps & Props> = (props) => {
  const { predictionDaily, predictionDailyLoading, predictionDailyError, getPredictionDaily, symbol, durChoice, setdurChoice, preChoice, setPreChoice } = props;

  const fetchPredictDaily = () => {
    const predictionType = predictOpts[preChoice].idtype;
    getPredictionDaily({ symbol, predictionType });
  };

  const durOpts: durChoiceParams = useMemo(() => {
    return durationOptionsObj;
  }, []);

  const predictOpts: predictionModeParams = useMemo(() => {
    return predictionOptionsObj;
  }, []);

  const predictionControlComponent = (
    <Container className="generic-container-scrolling">
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Prediction Status: </Col>
        <Col>
          <Badge
            variant={statusBadgeModifier(
              predictionDaily,
              predictionDailyLoading,
              predictionDailyError
            )}
          >
            {statusBadgeText(
              predictionDaily,
              predictionDailyLoading,
              predictionDailyError
            )}
          </Badge>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Duration: </Col>
        <Col>
          <DropdownButton
            variant="light"
            id="dropdown-basic-button"
            title={durOpts[durChoice].display + " " + durOpts[durChoice].units}
          >
            {Object.entries(durOpts).map((entry, idx) => {
              const [key, value] = entry;

              return (
                <Dropdown.Item
                  key={idx}
                  href="#/action-1"
                  onClick={() => {
                    setdurChoice(key);
                  }}
                >
                  {value.display + " " + value.units}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Model: </Col>
        <Col>
          <DropdownButton
            variant="light"
            id="dropdown-basic-button"
            title={predictOpts[preChoice].name}
          >
            {Object.entries(predictOpts).map((entry, idx) => {
              const [key, value] = entry;

              return (
                <Dropdown.Item
                  key={idx}
                  href="#/action-1"
                  onClick={() => {
                    setPreChoice(key);
                  }}
                >
                  {value.name}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        </Col>
      </Row>
      <hr />
      <Row className="justify-content-center">
        <Button
          variant="primary"
          onClick={() => {
            fetchPredictDaily();
          }}
        >
          Predict
        </Button>
      </Row>
    </Container>
  );

  return predictionControlComponent;
}

const mapStateToProps = (state: any) => ({
  predictionDailyLoading: state.stockReducer.predictionDaily.loading,
  predictionDailyError: state.stockReducer.predictionDaily.error,
  predictionDaily: state.stockReducer.predictionDaily.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getPredictionDaily: (payload: getPredictionDailyParams) =>
      dispatch(stockActions.getPredictionDaily(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PredictionController);
