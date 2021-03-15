import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Actions from '../redux/actions/user';
import ClipLoader from 'react-spinners/ClipLoader';
import { useHistory } from 'react-router-dom';

interface IObjectKeys {
  [key: string]: string | number;
}

interface RegisterFormParams extends IObjectKeys {
  email: string;
  password: string;
};

interface StateProps {
  isLoading: boolean;
  error: Object;
  token: string;
}

interface DispatchProps {
  loginUser: (payload: RegisterFormParams) => void;
}

const LoginForm: React.FC<StateProps & DispatchProps> = (props) => {
  const { isLoading, token, error, loginUser } = props;
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      history.push('/');
    }
  })

  const onSubmit = (e: any) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  const formComponent = (
    <Form onSubmit={(e) => onSubmit(e)}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
      >
        Login
      </Button>
    </Form>
  );

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={'green'} loading={isLoading} />
      <h5>Preparing rocket fuel...</h5>
    </div>
  );

  return (
    isLoading
    ? loadingSpinnerComponent
    : formComponent
  );
};

const mapStateToProps = (state: any) => ({
  isLoading: state.loginUser.loginUser.loading,
  token: state.loginUser.loginUser.token,
  error: state.loginUser.loginUser.error
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    loginUser: (formPayload: any) => { dispatch(Actions.loginUser(formPayload)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);