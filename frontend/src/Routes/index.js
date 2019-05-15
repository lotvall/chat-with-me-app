import React from 'react'
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import decode from 'jwt-decode'
import LandingPage from './LandingPage'
import Login from './Login'
import Register from './Register'
import AppLayout from '../components/AppLayout'


const isAuthenticated = () => {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')

    try {
        decode(token)
        const { exp } = decode(refreshToken)
        if( Date.now() / 1000 > exp) {
            return false
        }
    } catch {
        return false
    }

    return true
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (isAuthenticated() ? (
            <Component {...props} />
            ) : (
            <Redirect
                to={{
                pathname: "/login",
                state: { from: props.location }
                }}
            />
            ))
        }
    />
  );

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={LandingPage}/>
                <Route path='/login' exact component={Login}/>
                <Route path='/register' exact component={Register}/>
                <Route path='/layout' exact component={AppLayout}/>
            </Switch>
        </BrowserRouter>
    )
} 