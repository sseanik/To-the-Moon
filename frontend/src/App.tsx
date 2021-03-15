import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import configureStore from "./redux/configureStore";
import { Provider } from "react-redux";
import Container from "react-bootstrap/Container";
import { Header } from "./components";
import { LandingPage, SignupPage, PortfolioPage } from "./screens";

const initialState = {
  auth: false,
};

function App() {
  return (
    <div className="App">
      <Provider store={configureStore(initialState)}>
        <Header />
        <BrowserRouter>
          <Container fluid className="app-container justify-content-center">
            <Switch>
              <Route path="/" component={LandingPage} exact />
              <Route path="/register" component={SignupPage} />
              <Route path="/portfolio/:id" component={PortfolioPage} />
            </Switch>
          </Container>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
