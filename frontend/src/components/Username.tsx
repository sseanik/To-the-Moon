import { Navbar } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import userActions from "../redux/actions/userActions";

interface StateProps {
  token?: string;
  username?: string;
  loading: boolean;
}

interface DispatchProps {
  logout: () => void;
  getUsername: () => void;
}

const Username: React.FC<StateProps & DispatchProps> = (props) => {
  const { token, username, loading, logout, getUsername } = props;
  const history = useHistory();

  useEffect(() => {
    if (token && !username) {
      getUsername();
    }
    if (!token) {
      logout();
      history.push("/");
    }
  }, []);

  const usernameComponent = (
    <Navbar.Text className="mr-sm-2">Signed in as: {username}</Navbar.Text>
  );

  const loadingSpinnerComponent = (
    <div className="mr-sm-2">
      <ClipLoader color={"green"} loading={loading}>
        <span className="sr-only">Loading...</span>
      </ClipLoader>
    </div>
  );

  return username ? usernameComponent : loadingSpinnerComponent;
};

const mapStateToProps = (state: any) => ({
  token: state.userReducer.token,
  username: state.userReducer.username,
  loading: state.userReducer.user.loading,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => dispatch(userActions.logout()),
    getUsername: () => dispatch(userActions.getUsername()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Username);
