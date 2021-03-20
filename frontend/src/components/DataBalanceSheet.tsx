import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import {
  Container,
  Table,
  Row,
  Col
} from "react-bootstrap";

import StockAPI from "../api/stock";

interface BalanceSheetEntry {
  fiscaldateending: string;
  total_assets: number;
  total_curr_assets: number;
  total_ncurr_assets: number;
  total_liabilities: number;
  total_curr_liabilities: number;
  total_ncurr_liabilities: number;
  total_equity: number;
}

interface IObjectKeys {
  [key: string]: AttributeValues;
}

interface AttributeValues {
  name: string;
}

interface Props {
  // balanceSheet: Array<BalanceSheetEntry>;
  symbol: string;
  tryLoading: boolean;
}

const formatMap: IObjectKeys = {
  fiscaldateending: {name: "Year Ending"},
  total_assets: {name: "Total Assets"},
  total_curr_assets: {name: "Total Current Assets"},
  total_ncurr_assets: {name: "Total Non-Current Assets"},
  total_liabilities: {name: "Total Liabilities"},
  total_curr_liabilities: {name: "Total Current Liabilities"},
  total_ncurr_liabilities: {name: "Total Non-Current Liabilities"},
  total_equity: {name: "Total Equity"},
};

const DataBalanceSheet: React.FC<Props> = (props) => {
  const { symbol, tryLoading } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [balanceSheet, setBalanceSheet] = useState<any>([]);

  const fetchBalanceSheet = () => {
    async function fetchBalance() {
      var balancedata = symbol ? await StockAPI.getBalance(symbol) : {};
      if (balancedata) {
        setBalanceSheet(balancedata.data);
        setIsLoading(false);
      }
    }
    fetchBalance();
  }

  useEffect(() => {
    if (tryLoading) {
      fetchBalanceSheet();
    }
  }, [tryLoading]);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={isLoading} />
      <h5>Loading Balance Sheet ...</h5>
    </div>
  );

  const tableComponent = (
    <Container>
    <Row>
      {balanceSheet.map((entry: BalanceSheetEntry) => (
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

export default DataBalanceSheet;
