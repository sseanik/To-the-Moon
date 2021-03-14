import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from "react-bootstrap";
import { connect, MapStateToPropsParam } from "react-redux";

const dropdownNavLinks = [
  { href: "portfolio", name: "My Portfolios"},
  { href: "stock", name: "Stocks"},
  { href: "news", name: "News"},
  { href: "watchlist", name: "Watchlists"},
  { href: "screener", name: "Screeners"},
  { href: "forum", name: "Forum"},
  { href: "logout", name: "Logout"},
];

// TODO: Make this connected to Redux so it updates automatically instead of every render
const Header: React.FC = () => {
  const privateNav = () => (
    <Nav className="mr-auto">
      <Nav.Link href="/home">Home</Nav.Link>
      <Nav.Link href="/dashboard">Dashboard</Nav.Link>
      <NavDropdown title="Dropdown" id="basic-nav-dropdown">
        {dropdownNavLinks.map((link) => (
            <NavDropdown.Item href={link.href}>{link.name}</NavDropdown.Item>
          ))
        }
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
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">To The Moon</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        { window.localStorage.getItem("Token") 
          ? privateNav()
          : publicNav()
        }
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;