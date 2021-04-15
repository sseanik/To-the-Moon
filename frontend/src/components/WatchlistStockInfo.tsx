import { Col, Row } from "react-bootstrap";

interface Props {
  stock_ticker: string;
  proportion: number;
  price: number;
  price_change_percentage: number;
  volume: number;
  market_capitalization: number;
  PE_ratio: number;
}

const WatchlistStockInfo: React.FC<Props> = (props) => {
  const {
    stock_ticker,
    proportion,
    price,
    price_change_percentage,
    volume,
    market_capitalization,
    PE_ratio,
  } = props;

  return (
    <Row className="border-bottom border-light my-2 w-100 align-items-center py-1">
      <Col>
        <a href={`/stock/${stock_ticker}`}>{stock_ticker}</a>
      </Col>
      <Col>{proportion}</Col>
      <Col>
        <p className="d-inline mr-1">${price.toFixed(2)}</p>
        <p
          className={`d-inline ml-1 ${
            price_change_percentage >= 0 ? "text-success" : "text-danger"
          }`}
        >
          ({price_change_percentage}%)
        </p>
      </Col>
      <Col>{volume}</Col>
      <Col>{market_capitalization}</Col>
      <Col>{PE_ratio}</Col>
    </Row>
  );
};

export default WatchlistStockInfo;
