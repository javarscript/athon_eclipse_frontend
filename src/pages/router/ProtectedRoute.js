import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import queryString from 'query-string';

export const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        let params = queryString.parse(props.location.pathname.substr(7,props.location.pathname.length));
        return((localStorage.getItem('token')||params.token)
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
    }} />
)