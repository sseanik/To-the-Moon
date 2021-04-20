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
        <Image src={logo} style={logoStyles} />
      </Row>
      <Row className="justify-content-center mt-2">
        <h1>To The Moon 🌕</h1>
      </Row>
      <Row className="justify-content-center my-2">
        <h5>
          Welcome to To The Moon, a stock trading and portfolio management
          platform!
          <br></br>
          Browse trending topics below, or click My Portfolios ⬆️ to get
          started.
        </h5>
      </Row>
      <Row className="justify-content-center mt-5">
        <h2>Trending Investments</h2>
      </Row>
      <Row className="justify-content-center mb-3">
        <TrendingInvestments />
      </Row>
      <Row className="justify-content-center mt-5">
        <h2>Featured News</h2>
      </Row>
      <Row className="mb-3">
        <NewsCarousel />
      </Row>
    </Container>
  );
};

export default LandingPage;
