import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

interface CreateStockParams {
  portfolioName: string;
  stockName: string;
  userID: string;
}

interface CreateStockState {
  values: CreateStockParams;
  errors: CreateStockParams;
}

interface StateProps {
  createStockForm: CreateStockState;
  isLoading: boolean;
  error: Object;
  token: string;
}

interface DispatchProps {
  submitForm: (payload: CreateStockParams) => void;
  createStock: (payload: CreateStockParams) => void;
}

interface Props {
  portfolioName: string;
}

const CreateStockForm: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const {
    createStockForm,
    isLoading,
    token,
    error,
    submitForm,
    createStock,
    portfolioName,
  } = props;
  // purposely input dummy data
  const userID = "b1c88e2c-82fb-11eb-aa00-0a4e2d6dea13";
  const [stockName, setStockName] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();
    createStock({ portfolioName, stockName, userID });
  };

  const onBlur = () => {
    submitForm({ portfolioName, stockName, userID });
  };

  const formComponent = (
    <Form onSubmit={(e) => onSubmit(e)}>
      <Form.Group controlId="formBasicName">
        <Form.Label>Stock Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter stock name"
          isInvalid={createStockForm.errors.stockName.length > 0}
          isValid={
            !!createStockForm.values.stockName &&
            createStockForm.errors.stockName.length === 0
          }
          onChange={(e) => setStockName(e.target.value)}
          onBlur={onBlur}
        />
        <Form.Control.Feedback type="invalid">
          {createStockForm.errors.stockName}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Choose a valid stock symbol.
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit">
        Create Portfolio
      </Button>
    </Form>
  );

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={isLoading} />
      <h5>Preparing rocket fuel...</h5>
    </div>
  );

  return <p>Hi</p>;
};

const mapStateToProps = (state: any) => ({
  createPortfolioForm: state.submitCreatePortfolioForm.createPortfolioForm,
  isLoading: state.createPortfolio.createPortfolio.loading,
  token: state.createPortfolio.createPortfolio.token,
  error: state.createPortfolio.createPortfolio.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    submitForm: (formPayload: CreateStockFormParams) => {
      dispatch(portfolioActions.submitCreatePortfolioForm(formPayload));
    },
    createPortfolio: (formPayload: CreateStockFormParams) => {
      dispatch(portfolioActions.createPortfolio(formPayload));
    },
  };
};
