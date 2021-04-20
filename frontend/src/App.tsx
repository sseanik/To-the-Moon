import "bootswatch/dist/darkly/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import configureStore from "./redux/configureStore";
import { Provider } from "react-redux";
import Container from "react-bootstrap/Container";
import { ToastContainer } from "react-toastify";
import {
  LandingPage,
  SignupPage,
  StockPage,
  LoginPage,
  AboutUsPage,
  PortfolioPage,
  CreatePortfolioPage,
  SearchStockPage,
  ScreenersPage,
} from "./screens";
import { Header, NoteList } from "./components";
import PortfoliosPage from "./screens/PortfoliosPage";
import WatchlistPage from "./screens/WatchlistPage";
import WatchlistsPage from "./screens/WatchlistsPage";
import Footer from "./components/Footer";

const initialState = {};

function App() {
  return (
    <div className="App">
      <Provider store={configureStore(initialState)}>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <BrowserRouter>
          <Header />
          <Container
            fluid
            className="mt-3 app-container justify-content-center"
          >
            <Container className="dark-blue-container">
              <Switch>
                <Route path="/" component={LandingPage} exact />
                <Route
                  path="/create_portfolio"
                  component={CreatePortfolioPage}
                />
                <Route path="/portfolio/:name" component={PortfolioPage} />
                <Route path="/about-us" component={AboutUsPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/stock" component={SearchStockPage} exact />
                <Route path="/stock/:symbol" component={StockPage} />
                <Route path="/portfolios" component={PortfoliosPage} />
                <Route path="/screeners" component={ScreenersPage} />
                <Route path="/watchlists" component={WatchlistsPage} />
                <Route
                  path="/watchlist/:watchlistID"
                  component={WatchlistPage}
                />
              </Switch>
            </Container>
            <NoteList />
          </Container>
          <Footer />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
