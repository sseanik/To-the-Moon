import React, { useEffect, useState } from "react";
import { Alert, Container, Row } from "react-bootstrap";
import { useParams } from "react-router";
import portfolioAPI from "../api/portfolioAPI";

interface Props {
  token?: string;
}

interface RouteMatchParams {
  name: string;
}

const PortfolioPage: React.FC<Props> = (props) => {
  const { token } = props;
  const [authenticated, setAuthenticated] = useState(false);

  const [stockData, setStockData] = useState("");

  useEffect(() => {
    // api call
    //setStockData(/*api return*/);
    portfolioAPI.getPortfolio(name);
  });

  useEffect(() => {
    if (token !== "" || window.localStorage.getItem("Token")) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [token]);

  const { name } = useParams<RouteMatchParams>();
  // get token from from redux store
  // retrieve userID
  // pass token + userID to backend

  const allowed = () => (
    <Row>
      <p>You have access to {name}</p>
    </Row>
  );

  const denied = () => (
    <Row>
      <Alert variant="danger">
        <p>You do not have permission to access {name}</p>
      </Alert>
    </Row>
  );

  return <Container>{authenticated ? allowed() : denied()}</Container>;
};

export default PortfolioPage;
