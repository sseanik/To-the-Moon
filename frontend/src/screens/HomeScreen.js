import { Container, Row, Image } from "react-bootstrap";

export default function HomeScreen() {
    return (
        <Container>
            <Row className="justify-content-center">
                <Image src="shuttle.png" />
            </Row>
            <Row className="justify-content-center mt-2">
                <h1>Welcome To The Moon!</h1>
            </Row>
        </Container>
    );
}
