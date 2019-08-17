import React, { FunctionComponent } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, FormFeedback, Alert } from 'reactstrap';
import { Formik, Field, ErrorMessage, FormikActions, FormikProps, Form as FormikForm } from 'formik';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface FormValues {
  name: string;
}

type AddSpaceMutation = {
  addSpace: {
    id: number,
    name: string
  }
}

const ADD_SPACE= gql`
  mutation AddSpace($name: String!) {
    addSpace(name: $name) @client
  }
`;

function validateName(value?: string) {
  let error;
  if (!value) {
    error = 'A name for the workspace is required.';
  }
  return error;
}

const NewSpace: FunctionComponent<RouteComponentProps> = ({ history }) => {
  const [addSpace] = useMutation<AddSpaceMutation>(ADD_SPACE);

  return (
    <Container fluid className="p-4 p-md-5">
      <Row>
        <Col lg="8">
          <h1 className="h3">Add a new workspace</h1>
          <p className="text-muted">
            A workspace can be used to group related investigation objects such as BTC addresses within one view, 
            increasing clarity to better focus on a specific investigation subject.
          </p>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg="8">
          <Formik 
            initialValues={{ name: '' }} 
            onSubmit={async (values: FormValues, actions: FormikActions<FormValues>) => {
              const result = await addSpace({ variables: values });
              actions.setSubmitting(false);
              
              if (result && result.data) {
                history.push(`/spaces/${result.data.addSpace.id}`);
              } else {
                actions.setStatus({ api: "Request could not be processed."});
              }
           }}
           render={(formikBag: FormikProps<FormValues>) => (
            <Form tag={FormikForm}>
              {formikBag.status && formikBag.status.api && <Alert color="danger" className="mb-4">{formikBag.status.api}</Alert>}
              <FormGroup>
                <Label for="spaceName">Name of the workspace</Label>
                <Input 
                  tag={Field} 
                  name="name"
                  type="text"
                  id="spaceName" 
                  placeholder="Document A4144" 
                  validate={validateName} 
                  invalid={!!formikBag.errors.name} />
                <ErrorMessage name="name" component={FormFeedback} />
              </FormGroup>
              
              <Button color="primary" type="submit">Add workspace</Button>
            </Form>
          )}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(NewSpace);