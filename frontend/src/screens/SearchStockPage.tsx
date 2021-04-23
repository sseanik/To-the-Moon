import { Col, Container, Row } from "react-bootstrap";
import { SearchStockForm } from "../components";

const offeredStocks = [
  { ticker: "AMT", name: "American Tower" },
  { ticker: "BA", name: "Boeing" },
  { ticker: "BHP", name: "BHP Group" },
  { ticker: "CAT", name: "Caterpillar Inc." },
  { ticker: "CVX", name: "Chevron Corporation" },
  { ticker: "DUK", name: "Duke Energy" },
  { ticker: "IBM", name: "IBM" },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "JPM", name: "JPMorgan Chase" },
  { ticker: "KO", name: "The Coca-Cola Company" },
  { ticker: "LIN", name: "LafargeHolcim Ltd" },
  { ticker: "MA", name: "Mastercard" },
  { ticker: "NEE", name: "NextEra Energy" },
  { ticker: "NKE", name: "Nike" },
  { ticker: "ORCL", name: "Oracle Corporation" },
  { ticker: "PLD", name: "Prologis" },
  { ticker: "T", name: "AT&T" },
  { ticker: "TM", name: "Toyota" },
  { ticker: "UNH", name: "UnitedHealth Group" },
  { ticker: "VZ", name: "Verizon Communications" },
  { ticker: "WMT", name: "Walmart" },
  { ticker: "XOM", name: "ExxonMobil" },
];

const SearchStockPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <h1>Stocks</h1>
      </Row>
      <Row className="justify-content-center mb-4">
        <SearchStockForm />
      </Row>
      <h1>Offered Stocks</h1>
      <h5>To The Moon 🚀 supports the following selection of US Stocks:</h5>
      {offeredStocks.map((stockInfo, idx) => (
        <Row
          key={idx}
          className="border-top border-bottom py-2 align-items-center"
        >
          <Col>
            <a href={`/stock/${stockInfo.ticker}`}>{stockInfo.ticker}</a>
          </Col>
          <Col>{stockInfo.name}</Col>
        </Row>
      ))}
    </Container>
  );
};

export default SearchStockPage;
