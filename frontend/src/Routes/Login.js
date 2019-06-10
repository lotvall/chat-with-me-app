import React, { useState } from "react";
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import logo from '../static/images/logo.png'
import { wsLink } from '../index'

import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";

import "./Login.css";

const LOGIN_MUTATION = gql`
    mutation($username: String!, $password:String!){
        login(username:$username, password:$password){
            ok
            token
            refreshToken
            errors {
                message
                path
            }
        }
    }
`

const Login = ({history}) => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})

  const onSubmit = async (login) => {
    const response = await login({ variables: { username, password } })

    const { ok, token, refreshToken, errors } = response.data.login

    if (ok) {
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      wsLink.subscriptionClient.tryReconnect()
      history.push('/app')

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
    <Mutation mutation={LOGIN_MUTATION}>
      {(login, { data }) => (
        <div className="App">
          <Grid textAlign="center" verticalAlign="middle">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" color="blue" textAlign="center">
                <img alt="" src={logo} className="image" />
                Log-in to your account
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
                  <Button onClick={() => onSubmit(login)} color="blue" fluid size="large">
                    Login
                </Button>
                </Segment>
              </Form>
              <Message>
                New to Chat With Me? <a href="http://localhost:3000/register">Sign Up</a>
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

export default Login;