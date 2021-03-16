import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useFormik, Formik } from "formik";
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
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              id="portfolioName"
              name="portfolioName"
              type="text"
              placeholder="Enter new portfolio name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.portfolioName}
              isValid={!errors.portfolioName}
            />
            {errors.portfolioName ? (
              <Form.Control.Feedback>
                {errors.portfolioName}
              </Form.Control.Feedback>
            ) : (
              <Form.Control.Feedback>
                You must enter a unique portfolio name.
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button variant="outline-success" type="submit">
            Change Name
          </Button>
        </Form>
      )}
    </Formik>
  );
  /* const formik = useFormik({
    initialValues: {
      portfolioName: "",
    },
    validationSchema: Yup.object({
      portfolioName: Yup.string()
        .max(30, "Portfolio name must be 30 characters or less.")
        .required("Portfolio name is required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Form.Group>
        <Form.Control
          id="portfolioName"
          name="portfolioName"
          type="text"
          placeholder="Enter new portfolio name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.portfolioName}
          isValid={!formik.errors.portfolioName}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.portfolioName}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="outline-success" type="submit">
        Change Name
      </Button>
    </Form>
  ); */
};

export default EditPortfolioForm;
