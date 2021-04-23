import { Row, Col } from "react-bootstrap";
import DeleteStockButton from "./DeleteStockButton";

interface Props {
  investment_id: string;
  stock_ticker: string;
  num_shares: number;
  purchase_date: string;
  purchase_price: string;
  total_change: number;
  viewOnly?: boolean;
}

const StockInfo: React.FC<Props> = (props) => {
  const {
    investment_id,
    num_shares,
    purchase_date,
    purchase_price,
    stock_ticker,
    total_change,
    viewOnly = false,
  } = props;

  return (
    <Row className="my-2 w-100 align-items-center">
      <Col>
        <a href={`/stock/${stock_ticker}`}>{stock_ticker}</a>
      </Col>
      <Col>{num_shares}</Col>
      <Col>{purchase_date}</Col>
      <Col>${purchase_price}</Col>
      <Col className={total_change >= 0 ? "text-success" : "text-danger"}>
        {total_change.toFixed(2)}%
      </Col>
      {!viewOnly ? (
        <Col>
          <DeleteStockButton investmentID={investment_id} />
        </Col>
      ) : null}
    </Row>
  );
};

export default StockInfo;
