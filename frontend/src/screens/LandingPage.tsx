import { Container, Row, Image } from "react-bootstrap";
import logo from "../resources/shuttle.png";
import { NewsCarousel, NewsCard } from "../components";

const logoStyles = {
  height: "10vw",
};

const LandingPage: React.FC = () => {
  // TODO loading for news
  return (
    <Container>
      <Row className="justify-content-center">
        <Image src={logo} style={logoStyles}/>
      </Row>
      <Row className="justify-content-center mt-2">
        <h1>Welcome To The Moon!</h1>
      </Row>
      <Row>
        <h2>Featured News</h2>
      </Row>
      <Row>
        <NewsCarousel />
      </Row>
    </Container>
  );
}

export default LandingPage;