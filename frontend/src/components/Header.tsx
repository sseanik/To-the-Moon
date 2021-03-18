import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { connect } from "react-redux";

const dropdownNavLinks = [
  { href: "/portfolios", name: "My Portfolios"},
  { href: "/stock", name: "Stocks"},
  { href: "/news", name: "News"},
  { href: "/watchlist", name: "Watchlists"},
  { href: "/screener", name: "Screeners"},
  { href: "/forum", name: "Forum"},
  { href: "/logout", name: "Logout"},
];

interface Props {
  token?: string;
}

const Header: React.FC<Props> = (props) => {
  const { token } = props;

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (token !== "" || window.localStorage.getItem("Token")) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [token]);

  const privateNav = () => (
    <Nav className="mr-auto">
      <Nav.Link href="/home">Home</Nav.Link>
      <Nav.Link href="/dashboard">Dashboard</Nav.Link>
      <NavDropdown title="More" id="basic-nav-dropdown">
        {dropdownNavLinks.map((link) => (
          <NavDropdown.Item key={link.toString()} href={link.href}>
            {link.name}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    </Nav>
  );

  const publicNav = () => (
    <Nav className="mr-auto">
      <Nav.Link href="/about-us">About us</Nav.Link>
      <Nav.Link href="/login">Login</Nav.Link>
      <Nav.Link href="/signup">Sign up</Nav.Link>
    </Nav>
  );

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="/">To The Moon</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {authenticated ? privateNav() : publicNav()}
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.loginUser.loginUser.token,
});

export default connect(mapStateToProps, null)(Header);
