import { Navbar, Nav, Button, Image } from "react-bootstrap";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import userActions from "../redux/actions/userActions";
import { Username, NoteListToggle } from ".";
import logo from "../resources/shuttle.png";

const logoStyle = {
  width: "20px",
  marginRight: "10px",
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
};

interface LinkItem {
  href: string;
  name: string;
}

const privateNavBarLinks: Array<LinkItem> = [
  { href: "/", name: "Home" },
  { href: "/dashboard", name: "Dashboard" },
  { href: "/portfolios", name: "My Portfolios" },
  { href: "/stock", name: "Stocks" },
  { href: "/watchlists", name: "Watchlists" },
  { href: "/screeners", name: "Screeners" },
];

const publicNavBarLinks: Array<LinkItem> = [
  { href: "/signup", name: "Sign up" },
  { href: "/login", name: "Login" },
];

interface StateProps {
  token?: string;
}

interface DispatchProps {
  logout: () => void;
}

const Header: React.FC<StateProps & DispatchProps> = (props) => {
  const { token, logout } = props;
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  const handleRedirect = (href: string | null) => {
    if (href) {
      history.push(href);
    }
  };

  const privateNav = (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav
        className="mr-auto"
        onSelect={(selectedKey) => handleRedirect(selectedKey)}
      >
        {privateNavBarLinks.map((link, idx) => (
          <Nav.Link key={idx} eventKey={link.href}>
            {link.name}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar.Collapse>
  );

  const publicNav = (
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav
        className="mr-auto"
        onSelect={(selectedKey) => handleRedirect(selectedKey)}
      >
        <Nav.Link eventKey="/about-us">About Us</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  );

  const privateUserNav = (
    <Navbar.Collapse className="justify-content-end">
      <Username />
      <NoteListToggle />
      <Button variant="secondary" type="button" onClick={handleLogout}>
        Logout
      </Button>
    </Navbar.Collapse>
  );

  const publicUserNav = (
    <Navbar.Collapse className="justify-content-end">
      <Nav onSelect={(selectedKey) => handleRedirect(selectedKey)}>
        {publicNavBarLinks.map((link, idx) => (
          <Nav.Link key={idx} eventKey={link.href}>
            {link.name}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar.Collapse>
  );

  return (
    <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
      <Nav.Link
        onClick={() => handleRedirect("/")}
        className="justify-content"
        style={brandStyle}
      >
        <Image src={logo} style={logoStyle}></Image>
        <Navbar.Brand>To The Moon</Navbar.Brand>
      </Nav.Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {token ? privateNav : publicNav}
      {token ? privateUserNav : publicUserNav}
    </Navbar>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.userReducer.token,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => dispatch(userActions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
