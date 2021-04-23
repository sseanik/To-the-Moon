import "bootswatch/dist/darkly/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Switch } from "react-router-dom";
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
  SearchStockPage,
  PortfoliosPage,
  DashboardPage,
  WatchlistPage,
  WatchlistsPage,
  ScreenersPage,
} from "./screens";
import { Header, NoteList, Footer } from "./components";
import { PrivateRoute, PublicRoute } from "./helpers/Routes";

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
            <div className="dark-blue-container">
              <Switch>
                <PublicRoute
                  restricted={false}
                  path="/"
                  component={LandingPage}
                  exact
                />
                <PublicRoute
                  restricted={true}
                  path="/about-us"
                  component={AboutUsPage}
                />
                <PublicRoute
                  restricted={true}
                  path="/login"
                  component={LoginPage}
                />
                <PublicRoute
                  restricted={true}
                  path="/signup"
                  component={SignupPage}
                />
                <PrivateRoute path="/stock" component={SearchStockPage} exact />
                <PrivateRoute path="/stock/:symbol" component={StockPage} />
                <PrivateRoute
                  path="/portfolio/:name"
                  component={PortfolioPage}
                />
                <PrivateRoute path="/portfolios" component={PortfoliosPage} />
                <PrivateRoute path="/dashboard" component={DashboardPage} />
                <PrivateRoute path="/screeners" component={ScreenersPage} />
                <PrivateRoute path="/watchlists" component={WatchlistsPage} />
                <PrivateRoute
                  path="/watchlist/:watchlistID"
                  component={WatchlistPage}
                />
              </Switch>
            </div>
            <NoteList />
          </Container>
          <Footer />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
