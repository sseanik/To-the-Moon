import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";

interface ScreenerQueryFormValues {
  region: Array<string>;
  marketcap: string;
  intradayLower: number;
  intradayUpper: number;
  sector: Array<string>;
  industry: Array<string>;
}

interface industryChoiceOptions {
  [key: string]: Array<string>;
}

const initialValues = {
  region: ["United States"],
  marketcap: "",
  intradayLower: 0,
  intradayUpper: 0,
  sector: [""],
  industry: [""]
}

const schema = Yup.object({
  region: Yup.array().of(Yup.string()),
  marketcap: Yup.string()
    .required("marketcap symbol is required."),
  intradayLower: Yup.number(),
  intradayUpper: Yup.number(),
  sector: Yup.array().of(Yup.string()),
  industry: Yup.array().of(Yup.string()),
    // .required("One or more regions are required.")
})

const ScreenersQueryForm: React.FC = () => {
  const history = useHistory();

  const handleSubmit = (values: ScreenerQueryFormValues) => {
    // history.push(`/screeners/${values.marketcap}`);
    console.log(values);
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
                value={values.intradayLower}
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
                value={values.intradayUpper}
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

export default ScreenersQueryForm;
