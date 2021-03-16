import React, { useState } from "react";
import { Button, Row } from "react-bootstrap";
import { useFormik, Formik, Field, Form } from "formik";
import * as Yup from "yup";
import portfolioAPI from "../api/portfolioAPI";
import { useParams } from "react-router";

interface Props {
  handlePortfolioEdited: () => void;
}

interface RouteMatchParams {
  name: string;
}

const schema = Yup.object().shape({
  portfolioName: Yup.string()
    .required("Portfolio name is required.")
    .max(30, "Portfolio name must be 30 characters or less."),
});

const EditPortfolioForm: React.FC<Props> = (props) => {
  const { handlePortfolioEdited } = props;
  const { name } = useParams<RouteMatchParams>();

  const handleEditPortfolio = (values: any) => {
    const asyncEdit = async () => {
      await portfolioAPI.editPortfolio(name, values.portfolioName);
    };
    asyncEdit();
    handlePortfolioEdited();
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values) => {
        handleEditPortfolio(values);
      }}
      initialValues={{
        portfolioName: "",
      }}
    >
      {({ errors }) => (
        <Form>
          <Row className="justify-content-center my-1 rounded">
            <Field
              id="portfolioName"
              name="portfolioName"
              placeholder="Enter portfolio name"
              className="pl-2"
            />
          </Row>
          <Row className="justify-content-center my-1 text-muted">
            {errors.portfolioName
              ? errors.portfolioName
              : "Enter a unique name"}
          </Row>
          <Row className="justify-content-center my-1">
            <Button variant="outline-success" type="submit">
              Change Name
            </Button>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default EditPortfolioForm;
