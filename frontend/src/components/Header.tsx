import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import userActions from "../redux/actions/userActions";

const dropdownNavLinks = [
  { href: "/portfolios", name: "My Portfolios"},
  { href: "/stock", name: "Stocks"},
  { href: "/news", name: "News"},
  { href: "/watchlist", name: "Watchlists"},
  { href: "/screener", name: "Screeners"},
  { href: "/forum", name: "Forum"},
  { href: "/logout", name: "Logout"},
];

interface StateProps {
  token?: string;
  username?: string;
  loading: boolean;
  error?: string;
}

interface DispatchProps {
  logout: () => void;
  getUsername: () => void;
}

const Header: React.FC<StateProps & DispatchProps> = (props) => {
  const { token, username, loading, error, logout, getUsername } = props;
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  const privateNav = (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/home">Home</Nav.Link>
        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        <NavDropdown title="More" id="basic-nav-dropdown">
          {dropdownNavLinks.map((link, idx) => (
            <NavDropdown.Item key={idx} href={link.href}>
              {link.name}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  );

  const privateUserNavContainer = (
    <Navbar.Collapse className="justify-content-end">
      

      <Button variant="light" type="button" onClick={handleLogout}>
        Logout
      </Button>
    </Navbar.Collapse>
  );

  const privateUser = (
    {
      username  
      ? username
      : <ClipLoader color={"green"} loading={loading}>
          <span className="sr-only">Loading...</span>
        </ClipLoader>
    }
  )

  const publicNav = (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/about-us">About us</Nav.Link>
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/signup">Sign up</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  );

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="/">To The Moon</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {token ? privateNav : publicNav}
      {token ? privateUserNav : null}
    </Navbar>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.userReducer.token,
  username: state.userReducer.username,
  loading: state.userReducer.user.loading,
  error: state.userReducer.user.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => dispatch(userActions.logout()),
    getUsername: () => dispatch(userActions.getUsername),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
