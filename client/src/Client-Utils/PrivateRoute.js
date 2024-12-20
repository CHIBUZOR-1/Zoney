import React from 'react'
import { Route, Navigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const isAuthenticated = useSelector(state => state?.user?.userId);
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
}

export default PrivateRoute