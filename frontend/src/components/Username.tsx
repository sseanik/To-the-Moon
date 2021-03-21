import { Navbar } from "react-bootstrap";
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
  getUsername: () => void;
}

const Username: React.FC<StateProps & DispatchProps> = (props) => {
  const { token, username, loading, error, getUsername } = props;
  const history = useHistory();

  useEffect(() => {
    if (token && !username) {
      getUsername();
    }
  });

  const usernameComponent = (
    <Navbar.Text className="mr-sm-2">
      Signed in as: {username}
    </Navbar.Text>
  );

  const loadingSpinnerComponent = (
    <ClipLoader color={"green"} loading={loading}>
      <span className="sr-only">Loading...</span>
    </ClipLoader>
  );

  return username ? usernameComponent : loadingSpinnerComponent;

  return (
    {
      username  
      ? username
      : <ClipLoader color={"green"} loading={loading}>
          <span className="sr-only">Loading...</span>
        </ClipLoader>
    }
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
    getUsername: () => dispatch(userActions.getUsername),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Username);
