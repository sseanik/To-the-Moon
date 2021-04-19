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

interface getPaperTradingParams {
  symbol: string;
  initial_cash: number;
  commission: number;
  strategy: string;
  fromdate: string;
  todate: string;
}

interface tradeStratParams {
  [key: string]: { idtype: string, name: string };
}

interface Props {
  symbol: string;
}

interface StateProps {
  loading: boolean;
  data: any;
  error: any;
}

interface DispatchProps {
  getPaperTradingResults: (payload: getPaperTradingParams) => void;
}

const PaperTradeController: React.FC<StateProps & DispatchProps & Props> = (props) => {
  const { loading, data, error, getPaperTradingResults, symbol } = props;

  const [paperTradeParams, setPaperTradeParams] = useState<object | any>({
    symbol: symbol,
    initial_cash: 100000,
    commission: 0.0001,
    strategy: "RSIStack",
    fromdate: "2020-03-01",
    todate: "2021-04-07",
  });

  const tradeStratOpts: tradeStratParams = useMemo(() => {
    return {
      "RSIStack": { idtype: "RSIStack", name: "Relative Strength Index"},
      "SMACrossOver1": { idtype: "SMACrossOver1", name: "Simple MA Crossover" },
      "SMACrossOver2": { idtype: "SMACrossOver2", name: "Simple MA Crossover with BBands" }, 
    };
  }, []);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading Statistics ...</h5>
    </div>
  );

  const alertComponent = (
    <Alert variant="danger">
      {error}
    </Alert>
  );

  const fetchPaperTrades = () => {
    getPaperTradingResults({ ... paperTradeParams });
  }

  const paperTradeControlComponent = (
    <Container className="generic-container-scrolling">
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Initial Value ($): </Col>
        <Col>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="xxxxxx"
              aria-label="initialValue"
              aria-describedby="basic-addon1"
              type="number"
              value={paperTradeParams.initial_cash}
              onChange={(e) => {
                setPaperTradeParams({...paperTradeParams, initial_cash: e.target.value});
              }}
            />
          </InputGroup>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Commission: </Col>
        <Col>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="xxxxxx"
              aria-label="commission"
              aria-describedby="basic-addon1"
              type="number"
              value={paperTradeParams.commission}
              onChange={(e) => {
                setPaperTradeParams({...paperTradeParams, commission: e.target.value});
              }}
            />
          </InputGroup>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Strategy: </Col>
        <Col>
          <DropdownButton
            variant="outline-dark"
            id="dropdown-basic-button"
            title={tradeStratOpts[paperTradeParams.strategy].name}
          >
            {Object.entries(tradeStratOpts).map((entry, idx) => {
              const [key, value] = entry;
              return (
                <Dropdown.Item
                  key={key}
                  href="#/action-1"
                  onClick={() => {
                    setPaperTradeParams({...paperTradeParams,
                      strategy: tradeStratOpts[key].idtype})
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
      <Row>
        <Col className="text-left font-weight-bold">From: </Col>
        <Col>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="YYYY-MM-DD"
              aria-label="fromdate"
              aria-describedby="basic-addon1"
              type="date"
              value={paperTradeParams.fromdate}
              onChange={(e) => {
                setPaperTradeParams({...paperTradeParams, fromdate: e.target.value});
              }}
            />
          </InputGroup>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">To: </Col>
        <Col>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="YYYY-MM-DD"
              aria-label="todate"
              aria-describedby="basic-addon1"
              type="date"
              value={paperTradeParams.todate}
              onChange={(e) => {
                setPaperTradeParams({...paperTradeParams, todate: e.target.value});
              }}
            />
          </InputGroup>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Simulation Status: </Col>
        <Col>
          <Badge
            variant={statusBadgeModifier(
              data,
              loading,
              error,
            )}
          >
            {statusBadgeText(
              data,
              loading,
              error,
            )}
          </Badge>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-left font-weight-bold"># orders: </Col>
        <Col className="text-right">
          {data.hasOwnProperty("n_orders") ? data['n_orders'] : "N/A"}
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Value Change: </Col>
        <Col className="text-right">
          {data.hasOwnProperty("change_value") ? data['change_value'] : "N/A"}
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-left font-weight-bold">Value Change (%): </Col>
        <Col className="text-right">
          {data.hasOwnProperty("change_value_percentage") ? data['change_value_percentage']: "N/A"}
        </Col>
      </Row>
      <hr />
      <Row>
        <Button
          variant="outline-primary"
          onClick={() => {
            fetchPaperTrades();
          }}
        >
          Simulate
        </Button>
      </Row>
    </Container>
  );

  return paperTradeControlComponent;
}

const mapStateToProps = (state: any) => ({
  loading: state.stockReducer.paperTradingResults.loading,
  error: state.stockReducer.paperTradingResults.error,
  data: state.stockReducer.paperTradingResults.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getPaperTradingResults: (payload: getPaperTradingParams) =>
      dispatch(stockActions.getPaperTradingResults(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaperTradeController);
