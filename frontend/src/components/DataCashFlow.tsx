import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import {
  Container,
  Row,
  Col
} from "react-bootstrap";

import StockAPI from "../api/stock";
import {
  cashFlowStatementFormatter as formatMap
} from "../helpers/ObjectFormatRules";

interface CashFlowEntry {
  stockticker: string;
  fiscaldateending: string;
  operatingcashflow: string;
  paymentsforoperatingactivities: string;
  changeinoperatingliabilities: string;
  changeinoperatingassets: string;
  depreciationdepletionandamortization: string;
  changeininventory: string;
  cashflowfrominvestment: string;
  cashflowfromfinancing: string;
  dividendpayout: string;
  proceedsfromrepurchaseofequity: string;
  changeincashandcashequivalents: string;
  netincome: string;
}

interface Props {
  // cashFlow: Array<CashFlowEntry>;
  symbol: string;
  tryLoading: boolean;
}

const DataCashFlow: React.FC<Props> = (props) => {
  const { symbol, tryLoading } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [cashFlow, setCashFlow] = useState<any>([]);

  const fetchCashFlow = () => {
    async function fetchCash() {
      const cashdata = symbol ? await StockAPI.getCashFlow(symbol) : {};
      if (cashdata.data) {
        setCashFlow(cashdata.data);
        setIsLoading(false);
      }
    }
    fetchCash();
  }

  useEffect(() => {
    if (tryLoading) {
      fetchCashFlow();
    }
  }, [tryLoading]);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={isLoading} />
      <h5>Loading Data ...</h5>
    </div>
  );

  const tableComponent = (
    <Container>
    <Row>
      {cashFlow.map((entry: CashFlowEntry) => (
        <Col>
          <hr />
          {Object.entries(entry).map(([field, value]) => (
            <div>
              <Row lg={6}>
                <Col className="text-left" lg={6}>
                  <span>
                    <b>{formatMap[field].name}</b>
                  </span>
                </Col>
                <Col className="text-right" lg={6}>
                  <span>
                    {typeof value === "string" ? value : value / 1000}
                  </span>
                </Col>
              </Row>
              <hr />
            </div>
          ))}
        </Col>
      ))}
    </Row>
    </Container>
  );

  return isLoading ? loadingSpinnerComponent : tableComponent;
}

export default DataCashFlow;
