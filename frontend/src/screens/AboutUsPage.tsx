import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutUsPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center mt-2">
        <h1>Welcome To The Moon!</h1>
      </Row>
      <Row>
        <Col lg={true}>
          <h2>What is <b>To The Moon</b>?</h2>
          <span>
            To The Moon is a stock portfolio management website! Here you can create and customise your personal portfolios to manage investments and seek out others who are doing the same with our platform. To The Moon currently supports US stocks and provides rich data to help users find the investments best suited to them.
          </span>
        </Col>
        <Col lg={true}>
          <h2>How can I get started?</h2>
          <span>
            Sign up for an account with To The Moon to get started today! Simply, click the Signup link in the navigation bar to create an account and follow the instructions.
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={true}>
          <h2>Who are we?</h2>
          <span>
            We are a group of 5 UNSW students studying Computer Science, and have created this web application as part of our capstone project. Feel free to explore around :D
          </span>
        </Col>
        <Col lg={true}>
          <h2>Contribute</h2>
          <span>
            TBD...
          </span>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutUsPage;