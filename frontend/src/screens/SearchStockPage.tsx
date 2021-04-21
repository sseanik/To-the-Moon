import { Col, Container, Row } from "react-bootstrap";
import { SearchStockForm } from "../components";

const offeredStocks = [
  { ticker: "BHP", name: "BHP Group" },
  { ticker: "LIN", name: "LafargeHolcim Ltd" },
  { ticker: "JPM", name: "JPMorgan Chase" },
  { ticker: "MA", name: "Mastercard" },
  { ticker: "WMT", name: "Walmart" },
  { ticker: "KO", name: "The Coca-Cola Company" },
  { ticker: "NEE", name: "NextEra Energy" },
  { ticker: "DUK", name: "Duke Energy" },
  { ticker: "XOM", name: "ExxonMobil" },
  { ticker: "CVX", name: "Chevron Corporation" },
  { ticker: "ORCL", name: "Oracle Corporation" },
  { ticker: "IBM", name: "IBM" },
  { ticker: "NKE", name: "Nike" },
  { ticker: "TM", name: "Toyota" },
  { ticker: "AMT", name: "American Tower" },
  { ticker: "PLD", name: "Prologis" },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "UNH", name: "UnitedHealth Group" },
  { ticker: "T", name: "AT&T" },
  { ticker: "VZ", name: "Verizon Communications" },
  { ticker: "BA", name: "Boeing" },
  { ticker: "CAT", name: "Caterpillar Inc." },
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
      <h1>List of Offered Stocks</h1>
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
