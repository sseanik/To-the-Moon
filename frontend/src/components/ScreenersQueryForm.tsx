import { Container, Col, Row, Button, Form, Alert } from "react-bootstrap";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { connect } from "react-redux";
import screenerActions from "../redux/actions/screenerActions";

import { 
  ScreenerQuery,
  paramsObjToScreenerParams
} from "../helpers/ScreenerQuery"

interface ScreenerFormValues {
  screenerName: string | null;
  region: Array<string>;
  marketcapLow: number | null;
  marketcapHigh: number | null;
  intradayLower: number | null;
  intradayUpper: number | null;
  sector: Array<string>;
  industry: Array<string>;
  epsLower: number | null | undefined;
  epsUpper: number | null | undefined;
  betaLower: number | null | undefined;
  betaUpper: number | null | undefined;
  payoutRatioLower: number | null | undefined;
  payoutRatioUpper: number | null | undefined;
}

interface getScreenerResultsParams {
  // parameters: ScreenerQuery;
  parameters: string;
}

interface saveScreenerParams {
  name: string;
  parameters: ScreenerQuery;
}

interface industryChoiceOptions {
  [key: string]: Array<string>;
}

const initialValues = {
  screenerName: null,
  region: ["United States"],
  marketcapLow: null,
  marketcapHigh: null,
  intradayLower: null,
  intradayUpper: null,
  sector: [""],
  industry: [""],
  epsLower: null,
  epsUpper: null,
  betaLower: null,
  betaUpper: null,
  payoutRatioLower: null,
  payoutRatioUpper: null,
}

const schema = Yup.object({
  region: Yup.array().of(Yup.string()),
  marketcapLow: Yup.number().nullable(true)
    .required("marketcap symbol is required."),
  marketcapHigh: Yup.number().nullable(true)
    .required("marketcap symbol is required."),
  intradayLower: Yup.number().nullable(true),
  intradayUpper: Yup.number().nullable(true),
  sector: Yup.array().of(Yup.string()),
  industry: Yup.array().of(Yup.string()),
    // .required("One or more regions are required.")
})

// Add Props

// Add StateProps
interface StateProps {
  resultsLoading: boolean;
  resultsData: Array<any>;
  resultsError: string;
  saveLoading: boolean;
  saveData: Array<any>;
  saveError: string;
}

// Add DispatchProps
interface DispatchProps {
  getScreenerResults: (payload: getScreenerResultsParams) => void;
  saveScreener: (payload: saveScreenerParams) => void;
}

const ScreenersQueryForm: React.FC<StateProps & DispatchProps> = (props) => {
  const {
    resultsLoading,
    resultsData,
    resultsError,
    saveLoading,
    saveData,
    saveError,
    getScreenerResults,
    saveScreener
  } = props;
  const history = useHistory();

  const formToParamsObj = (values: ScreenerFormValues) => {
    const yrLow = values.intradayLower;
    const yrHigh = values.intradayUpper;
    return {
      'securities_overviews': {
        "region": values.region,
        "market_cap": [values.marketcapLow ? values.marketcapLow : null, values.marketcapHigh ? values.marketcapHigh : null],
        "yearly_low": typeof yrLow === "number" && yrLow >= 0 ? yrLow : null,
        "yearly_high": typeof yrHigh === "number" && yrHigh >= 0 ? yrHigh : null,
        "eps": [values.epsLower ? values.epsLower : null, values.epsUpper ? values.epsUpper : null],
        "beta": [values.betaLower ? values.betaLower : null, values.betaUpper ? values.betaUpper : null],
        "payout_ratio": [values.payoutRatioLower ? values.payoutRatioLower : null, values.payoutRatioUpper ? values.payoutRatioUpper : null],
        "sector": values.sector, // to array
        "industry": values.industry, // to array
      }
    };
  }

  const doSubmit = (values: ScreenerFormValues) => {
    const paramObj = formToParamsObj(values);
    const parameters = paramsObjToScreenerParams(paramObj);
    getScreenerResults({ parameters });
  }

  const doSave = (values: ScreenerFormValues) => {
    const parameters = formToParamsObj(values);
    const name = values.screenerName;
    if (name) {
      saveScreener({ name, parameters });
    } else {
      console.warn("Name cannot be null");
    }
  }

  const regionChoices = ["United States", "United Kingdom", "Frankfurt"];
  const sectorChoices = ["Basic Materials", "Financial Services", "Consumer Defensive", "Utilities", "Energy", "Technology", "Consumer Cyclical", "Real Estate", "Healthcare", "Communication Services", "Industrials"];

  const industryChoices: industryChoiceOptions = {"Technology":
  ["Information Technology Services", "Software—Infrastructure", "Computer Hardware", "Electronic Components", "Scientific & Technical Instruments", "Semiconductors", "Software—Application", "Communication Equipment", "Consumer Electronics", "Electronics & Computer Distribution", "Semiconductor Equipment & Materials", "Solar"],
  "Consumer Cyclical": ["Auto & Truck Dealerships", "Auto Manufacturers", "Auto Parts", "Recreational Vehicles", "Furnishings", "Fixtures & Appliances", "Residential Construction", "Textile Manufacturing", "Apparel Manufacturing", "Footwear & Accessories", "Packaging & Containers", "Personal Services", "Restaurants", "Apparel Retail", "Department Stores", "Home Improvement Retail", "Luxury Goods", "Internet Retail", "Specialty Retail", "Gambling", "Leisure", "Lodging", "Resorts & Casinos", "Travel Services"]
  };

  return (
    <Formik
      onSubmit={doSubmit}
      initialValues={initialValues}
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
          <Form noValidate onSubmit={handleSubmit}>
            <Container>
              <Row>
              <Col>
                <Form.Group controlId="formSelectRegion">
                  <Form.Label>Region</Form.Label>
                  <Form.Control
                    className="mr-sm-2"
                    as="select"
                    name="region"
                    type="text"
                    value={values.region}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.region && touched.region}
                    multiple
                  >
                    {regionChoices.map((entry) =>
                      <option>{entry}</option>
                    )}
                  </Form.Control>
                  {errors.region && touched.region ? (
                    <Form.Control.Feedback type="invalid">
                      {errors.region}
                    </Form.Control.Feedback>
                  ) : null}
                </Form.Group>
                <Form.Group controlId="formSelectSector">
                  <Form.Label>Sector</Form.Label>
                  <Form.Control
                    className="mr-sm-2"
                    as="select"
                    name="sector"
                    type="text"
                    value={values.sector}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.sector && touched.sector}
                    multiple
                  >
                    {sectorChoices.map((entry) =>
                      <option>{entry}</option>
                    )}
                  </Form.Control>
                  {errors.sector && touched.sector ? (
                    <Form.Control.Feedback type="invalid">
                      {errors.sector}
                    </Form.Control.Feedback>
                  ) : null}
                </Form.Group>
                <Form.Group controlId="formSelectSector">
                  <Form.Label>Industry</Form.Label>
                  <Form.Control
                    className="mr-sm-2"
                    as="select"
                    name="industry"
                    type="text"
                    value={values.industry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.industry && touched.industry}
                    multiple
                  >
                    {values.sector.map((value) =>
                      industryChoices.hasOwnProperty(value) ?
                      industryChoices[value].map((entry) =>
                        <option>{entry}</option>
                      )
                      : ""
                    )}
                  </Form.Control>
                  {errors.industry && touched.industry ? (
                    <Form.Control.Feedback type="invalid">
                      {errors.industry}
                    </Form.Control.Feedback>
                  ) : null}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="marketcap">
                  <Form.Label>Market Capitalisation</Form.Label>
                    <Row>
                      <Col>
                        <Form.Control
                          className="mr-sm-2"
                          name="marketcapLow"
                          type="number"
                          placeholder="Lower"
                          value={undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!errors.marketcapLow && touched.marketcapLow}
                        />
                        {errors.marketcapLow && touched.marketcapLow ? (
                          <Form.Control.Feedback type="invalid">
                            {errors.marketcapLow}
                          </Form.Control.Feedback>
                        ) : null}
                      </Col>
                      <Col>
                        <Form.Control
                          className="mr-sm-2"
                          name="marketcapHigh"
                          type="number"
                          placeholder="Upper"
                          value={undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!errors.marketcapHigh && touched.marketcapHigh}
                        />
                        {errors.marketcapHigh && touched.marketcapHigh ? (
                          <Form.Control.Feedback type="invalid">
                            {errors.marketcapHigh}
                          </Form.Control.Feedback>
                        ) : null}
                      </Col>
                    </Row>
                </Form.Group>
                <Form.Group controlId="priceIntraday">
                  <Form.Label>Intraday Price</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        className="mr-sm-2"
                        type="number"
                        name="intradayLower"
                        placeholder="Lower"
                        value={undefined}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.intradayLower && touched.intradayLower}
                      />
                      {errors.intradayLower && touched.intradayLower ? (
                        <Form.Control.Feedback type="invalid">
                          {errors.intradayLower}
                        </Form.Control.Feedback>
                      ) : null}
                    </Col>
                    <Col>
                      <Form.Control
                        className="mr-sm-2"
                        type="number"
                        name="intradayUpper"
                        placeholder="Upper"
                        value={undefined}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.intradayUpper && touched.intradayUpper}
                      />
                      {errors.intradayUpper && touched.intradayUpper ? (
                        <Form.Control.Feedback type="invalid">
                          {errors.intradayUpper}
                        </Form.Control.Feedback>
                      ) : null}
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group controlId="eps">
                  <Form.Label>EPS</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        className="mr-sm-2"
                        name="epsLower"
                        type="number"
                        placeholder="Lower"
                        value={undefined}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.epsLower && touched.epsLower}
                      />
                      {errors.epsLower && touched.epsLower ? (
                        <Form.Control.Feedback type="invalid">
                          {errors.epsLower}
                        </Form.Control.Feedback>
                      ) : null}
                    </Col>
                    <Col>
                      <Form.Control
                        className="mr-sm-2"
                        name="epsUpper"
                        type="number"
                        placeholder="Upper"
                        value={undefined}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.epsUpper && touched.epsUpper}
                      />
                      {errors.epsUpper && touched.epsUpper ? (
                        <Form.Control.Feedback type="invalid">
                          {errors.epsUpper}
                        </Form.Control.Feedback>
                      ) : null}
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group controlId="beta">
                  <Form.Label>Beta</Form.Label>
                    <Row>
                      <Col>
                        <Form.Control
                          className="mr-sm-2"
                          name="betaLower"
                          type="number"
                          placeholder="Lower"
                          value={undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!errors.betaLower && touched.betaLower}
                        />
                        {errors.betaLower && touched.betaLower ? (
                          <Form.Control.Feedback type="invalid">
                            {errors.betaLower}
                          </Form.Control.Feedback>
                        ) : null}
                      </Col>
                      <Col>
                        <Form.Control
                          className="mr-sm-2"
                          name="betaUpper"
                          type="number"
                          placeholder="Upper"
                          value={undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!errors.betaUpper && touched.betaUpper}
                        />
                        {errors.betaUpper && touched.betaUpper ? (
                          <Form.Control.Feedback type="invalid">
                            {errors.betaUpper}
                          </Form.Control.Feedback>
                        ) : null}
                      </Col>
                    </Row>
                </Form.Group>
                <Form.Group controlId="payoutRatio">
                  <Form.Label>Payout Ratio</Form.Label>
                    <Row>
                      <Col>
                        <Form.Control
                          className="mr-sm-2"
                          name="payoutRatioLower"
                          type="number"
                          placeholder="Lower"
                          value={undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!errors.payoutRatioLower && touched.payoutRatioLower}
                        />
                        {errors.payoutRatioLower && touched.payoutRatioLower ? (
                          <Form.Control.Feedback type="invalid">
                            {errors.payoutRatioLower}
                          </Form.Control.Feedback>
                        ) : null}
                      </Col>
                      <Col>
                        <Form.Control
                          className="mr-sm-2"
                          name="payoutRatioUpper"
                          type="number"
                          placeholder="Upper"
                          value={undefined}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!errors.payoutRatioUpper && touched.payoutRatioUpper}
                        />
                        {errors.payoutRatioUpper && touched.payoutRatioUpper ? (
                          <Form.Control.Feedback type="invalid">
                            {errors.payoutRatioUpper}
                          </Form.Control.Feedback>
                        ) : null}
                      </Col>
                    </Row>
                </Form.Group>
              </Col>
              </Row>
            </Container>
            <Container>
              <Form.Group controlId="payoutRatio">
                <Form.Label>Screener Name</Form.Label>
                <Form.Control
                  className="mr-sm-2"
                  name="screenerName"
                  type="string"
                  placeholder="Name"
                  value={undefined}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.screenerName && touched.screenerName}
                />
                {errors.screenerName && touched.screenerName ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.screenerName}
                  </Form.Control.Feedback>
                ) : null}
              </Form.Group>
            </Container>

            <Container>
              <Row className="justify-content-md-center">
                <Col xs lg="2">
                  <Button disabled={!values.marketcapLow} size="lg" variant="success" onClick={() => { doSubmit(values); }}>Filter</Button>
                </Col>
                <Col xs lg="2">
                  <Button disabled={!values.screenerName} size="lg" variant="primary" onClick={() => { doSave(values); }}>Save</Button>
                </Col>
              </Row>
            </Container>
            <Container>
              <Row className="justify-content-center p-2">
                <Col xs lg="6">
                  {saveError ?
                    <Alert variant="danger">
                      {`Save failed: ${saveError}`}
                    </Alert>
                  : !saveError && saveData ?
                    <Alert variant="success">
                      {`Save succeeded`}
                    </Alert>
                  : ""}
                </Col>
              </Row>
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
}

// Add mapStateToProps
const mapStateToProps = (state: any) => ({
  resultsLoading: state.screenerReducer.results.loading,
  resultsError: state.screenerReducer.results.error,
  resultsData: state.screenerReducer.results.data,
  saveLoading: state.screenerReducer.saveStatus.loading,
  saveError: state.screenerReducer.saveStatus.error,
  saveData: state.screenerReducer.saveStatus.data,
});

// Add mapDispatchToProps
// getScreenerResults
// saveScreener - separate state, separate page
const mapDispatchToProps = (dispatch: any) => {
  return {
    getScreenerResults: (payload: getScreenerResultsParams) =>
      dispatch(screenerActions.getScreenerResults(payload)),
    saveScreener: (payload: saveScreenerParams) =>
      dispatch(screenerActions.saveScreener(payload)),
  };
};

// Connect
export default connect(mapStateToProps, mapDispatchToProps)(ScreenersQueryForm);
