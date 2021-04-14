import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { connect } from "react-redux";
import screenerActions from "../redux/actions/screenerActions";

interface ScreenerFormValues {
  // screenerName: string;
  region: Array<string>;
  marketcap: string;
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

interface ScreenerQuery {
  securities_overviews: {
    region: Array<string>;
    market_cap: string;
    yearly_low: number | null;
    yearly_high: number | null;
    sector: Array<string>;
    industry: Array<string>;
    eps: Array<number | null | undefined>;
    beta: Array<number | null | undefined>;
    payout_ratio: Array<number | null | undefined>;
  };
}

interface getScreenerResultsParams {
  // parameters: ScreenerQuery;
  parameters: string;
}

interface industryChoiceOptions {
  [key: string]: Array<string>;
}

const initialValues = {
  region: ["United States"],
  marketcap: "",
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
  marketcap: Yup.string()
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
  loading: boolean;
  data: Array<any>;
  error: string;
}

// Add DispatchProps
interface DispatchProps {
  getScreenerResults: (payload: getScreenerResultsParams) => void;
}

const ScreenersQueryForm: React.FC<StateProps & DispatchProps> = (props) => {
  const {
    loading,
    data,
    error,
    getScreenerResults
  } = props;
  const history = useHistory();

  const formToScreenerParams = (values: ScreenerFormValues) => {
    const yrLow = values.intradayLower;
    const yrHigh = values.intradayUpper;
    let paramsObj = {
      'securities_overviews': {
        "region": values.region,
        "market_cap": values.marketcap,
        "yearly_low": typeof yrLow === "number" && yrLow >= 0 ? yrLow : null,
        "yearly_high": typeof yrHigh === "number" && yrHigh >= 0 ? yrHigh : null,
        "eps": [values.epsLower ? values.epsLower : null, values.epsUpper ? values.epsUpper : null],
        "beta": [values.betaLower ? values.betaLower : null, values.betaUpper ? values.betaUpper : null],
        "payout_ratio": [values.payoutRatioLower ? values.payoutRatioLower : null, values.payoutRatioUpper ? values.payoutRatioUpper : null],
        "sector": values.sector, // to array
        "industry": values.industry, // to array
      }
    };

    let paramsStr = `?${Object.entries(paramsObj['securities_overviews']).map(([field, value], idx) => (
      typeof value === "string" || typeof value === "number"
        ? `${field}=${String(value)}`
      : Array.isArray(value)
        ? value.map((e: any) => (`${field}=${typeof e === "number" ? e : ""}`)).join("&")
      : value === null || value === undefined
        ? `${field}=`
      : `${field}=${String(value)}`
    )).join("&")}`;

    return paramsStr;
  };

  const handleSubmit = (values: ScreenerFormValues) => {
    console.log("Before conversion: ", values);
    const parameters = formToScreenerParams(values);
    console.log("After conversion: ", parameters);
    // console.log(getScreenerResults);
    getScreenerResults({ parameters });
  }

  const regionChoices = ["United States", "United Kingdom", "Frankfurt"];
  const marketCapChoices = ["Small", "Mid", "Large", "Extra Large"];
  const sectorChoices = ["Basic Materials", "Financial Services", "Consumer Defensive", "Utilities", "Energy", "Technology", "Consumer Cyclical", "Real Estate", "Healthcare", "Communication Services", "Industrials"];

  const industryChoices: industryChoiceOptions = {"Technology":
  ["Information Technology Services", "Software—Infrastructure", "Computer Hardware", "Electronic Components", "Scientific & Technical Instruments", "Semiconductors", "Software—Application", "Communication Equipment", "Consumer Electronics", "Electronics & Computer Distribution", "Semiconductor Equipment & Materials", "Solar"],
  "Consumer Cyclical": ["Auto & Truck Dealerships", "Auto Manufacturers", "Auto Parts", "Recreational Vehicles", "Furnishings", "Fixtures & Appliances", "Residential Construction", "Textile Manufacturing", "Apparel Manufacturing", "Footwear & Accessories", "Packaging & Containers", "Personal Services", "Restaurants", "Apparel Retail", "Department Stores", "Home Improvement Retail", "Luxury Goods", "Internet Retail", "Specialty Retail", "Gambling", "Leisure", "Lodging", "Resorts & Casinos", "Travel Services"]
  };

  return (
    <Formik
      onSubmit={handleSubmit}
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
            <Form.Group controlId="marketcap">
              <Form.Label>Market Capitalisation</Form.Label>
              <Form.Control
                className="mr-sm-2"
                as="select"
                name="marketcap"
                type="text"
                placeholder="Choose a market cap size"
                value={values.marketcap}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.marketcap && touched.marketcap}
              >
                {marketCapChoices.map((entry) =>
                  <option>{entry}</option>
                )}
              </Form.Control>
              {errors.marketcap && touched.marketcap ? (
                <Form.Control.Feedback type="invalid">
                  {errors.marketcap}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group controlId="priceIntraday">
              <Form.Label>Intraday Price (Lower)</Form.Label>
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
              <Form.Label>Intraday Price (Higher)</Form.Label>
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

            <Button disabled={!values.marketcap} size="lg" type="submit" variant="success">➱</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

// Add mapStateToProps
const mapStateToProps = (state: any) => ({
  loading: state.screenerReducer.results.loading,
  error: state.screenerReducer.results.error,
  data: state.screenerReducer.results.data,
});

// Add mapDispatchToProps
// getScreenerResults
// saveScreener - separate state, separate page
const mapDispatchToProps = (dispatch: any) => {
  return {
    getScreenerResults: (payload: getScreenerResultsParams) =>
      dispatch(screenerActions.getScreenerResults(payload)),
  };
};

// Connect
export default connect(mapStateToProps, mapDispatchToProps)(ScreenersQueryForm);
