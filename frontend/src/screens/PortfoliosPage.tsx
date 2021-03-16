import React, { useEffect, useState } from "react";
import { Container, Row, Alert, Button } from "react-bootstrap";
import portfolioAPI from "../api/portfolioAPI";
import PortfolioInfo from "../components/PortfolioInfo";

interface Props {
  token?: string;
}

const PortfoliosPage: React.FC<Props> = (props) => {
  const { token } = props;
  const [authenticated, setAuthenticated] = useState(false);
  const [portfolioList, setPortfolioList] = useState({
    portfolios: [{ portfolio_name: "" }],
  });

  useEffect(() => {
    const fetchStocks = async () => {
      const portfolios = portfolioAPI.getPortfolios();
      setPortfolioList(portfolios);
    };
    fetchStocks();
  });

  // may be removed soon
  useEffect(() => {
    if (token !== "" || window.localStorage.getItem("Token")) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [token]);

  const listPortfolios = portfolioList.portfolios.map((portfolio, id) => (
    <PortfolioInfo key={id} portfolio_name={portfolio.portfolio_name} />
  ));

  const allowed = () => (
    <Container>
      <Row className="justify-content-center my-3">
        <h1>Manage Portfolios</h1>
      </Row>
      <Row className="justify-content-center my-3">
        <Button href="/create_portfolio" variant="outline-primary">
          Add a portfolio
        </Button>
      </Row>
      <Row className="my-2">{listPortfolios}</Row>
    </Container>
  );

  const denied = () => (
    <Row>
      <Alert variant="danger">
        <p>You do not have permission to access the portfolios page</p>
      </Alert>
    </Row>
  );

  return <Container fluid>{authenticated ? allowed() : denied()}</Container>;
};

export default PortfoliosPage;
