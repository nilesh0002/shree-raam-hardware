import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminRoute from './components/AdminRoute';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import AdminUsersList from './components/AdminUsersList';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminMerchants from './components/SuperAdminMerchants';

function App() {
  const handleLoginSuccess = () => {
    window.location.href = '/admin/dashboard';
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/admin/login" 
            element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <AdminUsersList />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/merchants" 
            element={
              <AdminRoute>
                <SuperAdminMerchants />
              </AdminRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;