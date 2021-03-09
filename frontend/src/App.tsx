import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Container from "react-bootstrap/Container";
import {
  LandingPage,
  SignupPage
} from "./screens";
import {
  Header
} from "./components";

const initialState = {
  auth: false,
};

function App() {
  return (
    <div className="App">
        <Header />
        <BrowserRouter>
          <Container fluid className="app-container justify-content-center">
            <Switch>
              <Route path="/" component={LandingPage} exact />
              <Route path="/signup" component={SignupPage} />
            </Switch>
          </Container>
        </BrowserRouter>
    </div>
  );
}

export default App;
