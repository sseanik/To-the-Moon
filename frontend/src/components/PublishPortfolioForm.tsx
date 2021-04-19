import { Formik } from "formik";
import { Alert, Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import * as Yup from "yup";
import watchlistActions from "../redux/actions/watchlistActions";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "react-router";

interface RouteMatchParams {
  name: string;
}

interface StateProps {
  loading: boolean;
  error: string;
}

interface DispatchProps {
  addWatchlist: (payload: PublishPortfolioParams) => void;
}

interface PublishPortfolioParams {
  portfolioName: string;
  description: string;
}

const schema = Yup.object({
  description: Yup.string()
    .required("Description is required to publish a portfolio as a watchlist.")
    .max(5000, "Description must be 5000 characters or less."),
});

const PublishPortfolioForm: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, error, addWatchlist } = props;
  const { name: portfolioName } = useParams<RouteMatchParams>();

  const initialValues: PublishPortfolioParams = {
    portfolioName,
    description: "",
  };

  const formComponent = (
    <Formik
      onSubmit={addWatchlist}
      initialValues={initialValues}
      validationSchema={schema}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
      }) => {
        return (
          <Form noValidate onSubmit={handleSubmit} className="my-2">
            {error ? <Alert variant="danger">{error}</Alert> : null}
            <Form.Label>Watchlist Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              placeholder="Enter a description for your watchlist"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.description && touched.description}
            />
            {errors.description ? (
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            ) : (
              <Form.Text className="text-muted">
                Description must be provided for published watchlist.
              </Form.Text>
            )}

            <Button type="submit" variant="outline-primary" className="my-2">
              Publish Portfolio
            </Button>
          </Form>
        );
      }}
    </Formik>
  );

  return loading ? (
    <ClipLoader color={"green"} loading={loading} />
  ) : (
    formComponent
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.watchlistReducer.addWatchlist.loading,
  error: state.watchlistReducer.addWatchlist.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    addWatchlist: (formPayload: PublishPortfolioParams) => {
      dispatch(watchlistActions.addWatchlist(formPayload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishPortfolioForm);
