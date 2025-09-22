import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) return false;
    
    try {
      const decoded = jwt_decode(token);
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        return false;
      }
      
      // Check if user has admin role
      return decoded.role === 'admin';
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;