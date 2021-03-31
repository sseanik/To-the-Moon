import { Container, Row, Image } from "react-bootstrap";
import logo from "../resources/shuttle.png";
import { NewsCarousel, TrendingInvestments } from "../components";

const logoStyles = {
  height: "10vw",
};

const LandingPage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Image src={logo} style={logoStyles}/>
      </Row>
      <Row className="justify-content-center mt-2">
        <h1>Welcome To The Moon!</h1>
      </Row>
      <Row className="justify-content-center mt-5">
        <h2>Featured News</h2>
      </Row>
      <Row className="mb-3">
        <NewsCarousel />
      </Row>
      <Row className="justify-content-center mt-5">
        <h2>Trending Investments</h2>
      </Row>
      <Row className="mb-3">
        <TrendingInvestments />
      </Row>
    </Container>
  );
}

export default LandingPage;