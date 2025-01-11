import React from 'react'
import { Route, Navigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const isAuthenticated = useSelector(state => state.user.user?.id);
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
}

export default PrivateRoute