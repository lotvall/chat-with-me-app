import React, { useState } from "react";

import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import logo from '../static/images/logo.png'
import {withRouter} from 'react-router-dom'

import "semantic-ui-css/semantic.min.css";

import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";

import "./Register.css";

const REGISTER_USER_MUTATION = gql`
mutation ($username: String!, $password:String!){
    registerUser(username: $username, password: $password){
      ok
      errors{
        path
        message
      }
    }
  }
`

const Register = ({history}) => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})

  const onSubmit = async (registerUser) => {
    const response = await registerUser({ variables: { username, password } })

    const { ok, errors } = response.data.registerUser

    if (ok) {
      history.push('/login')

    } else {
      const err = {}
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message
      })
      setErrors(err)
    }
  }

  const { usernameError, passwordError } = errors

  let errorList = [];

  if (usernameError) {
    errorList = [...errorList, usernameError]
  }
  if (passwordError) {
    errorList = [...errorList, passwordError]
  }


  return (
    <Mutation mutation={REGISTER_USER_MUTATION}>
    {(registerUser, { data }) => (

      <div className="App">
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="blue" textAlign="center">
            <img alt="" src={logo} className="image" />{" "}
            Register your account
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                onChange={e => setUsername(e.target.value)}
                value={username}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={e => setPassword(e.target.value)}
                value={password}
              />
              <Button onClick={() => onSubmit(registerUser)} color="blue" fluid size="large">
                Sign up
              </Button>
            </Segment>
          </Form>
          <Message>
            Already have an account?<a href="http://localhost:3000/login"> Login</a>
          </Message>

          {
                (usernameError || passwordError) &&
                <Message
                  error
                  header='There was some errors with your submission'
                  list={errorList}
                />
              }
        </Grid.Column>
      </Grid>
    </div>

    )}

    </Mutation>
    
  );

}

export default withRouter(Register);