import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import HomeScreen from "./screens/HomeScreen";

function App() {
    return (
        <BrowserRouter>
            <Container fluid className="app-container justify-content-center">
                <Route path="/" component={HomeScreen} exact />
            </Container>
        </BrowserRouter>
    );
}

export default App;
