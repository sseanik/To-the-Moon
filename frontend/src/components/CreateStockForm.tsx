import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import stockActions from "../redux/actions/stockActions";

interface CreateStockFormParams {
  portfolioName: string;
  stockName: string;
  userID: string;
}

interface CreateStockState {
  values: CreateStockFormParams;
  errors: CreateStockFormParams;
}

interface StateProps {
  createStockForm: CreateStockState;
  isLoading: boolean;
  error: Object;
  token: string;
}

interface DispatchProps {
  submitForm: (payload: CreateStockFormParams) => void;
  createStock: (payload: CreateStockFormParams) => void;
}

interface Props {
  portfolioName: string;
  handleAddStock: () => void;
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
    handleAddStock,
  } = props;
  // purposely input dummy data
  const userID = "b1c88e2c-82fb-11eb-aa00-0a4e2d6dea13";
  const [stockName, setStockName] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();
    createStock({ portfolioName, stockName, userID });
    handleAddStock();
  };

  const onBlur = () => {
    submitForm({ portfolioName, stockName, userID });
  };

  const formComponent = (
    <Form onSubmit={(e) => onSubmit(e)}>
      <Form.Group controlId="formBasicName">
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
        Add Stock
      </Button>
    </Form>
  );

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={isLoading} />
      <h5>Preparing rocket fuel...</h5>
    </div>
  );

  return isLoading ? loadingSpinnerComponent : formComponent;
};

const mapStateToProps = (state: any) => ({
  createStockForm: state.submitCreateStockForm.createStockForm,
  isLoading: state.createStock.createStock.loading,
  token: state.createStock.createStock.token,
  error: state.createStock.createStock.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    submitForm: (formPayload: CreateStockFormParams) => {
      dispatch(stockActions.submitCreateStockForm(formPayload));
    },
    createStock: (formPayload: CreateStockFormParams) => {
      dispatch(stockActions.createStock(formPayload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateStockForm);
