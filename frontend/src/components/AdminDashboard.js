import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatCard = ({ title, value, icon, color, loading }) => {
  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${color} rounded-md flex items-center justify-center`}>
              <span className="text-white text-lg">{icon}</span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const isSuperAdmin = adminData.role === 'super_admin';

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/dashboard/stats`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isSuperAdmin ? 'Super Admin Dashboard' : 'Dashboard'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isSuperAdmin 
            ? 'Platform-wide overview and merchant management'
            : 'Overview of your e-commerce store performance'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Sales"
          value={formatCurrency(stats.totalSales)}
          icon="💰"
          color="bg-green-500"
          loading={loading}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon="📦"
          color="bg-yellow-500"
          loading={loading}
        />
        <StatCard
          title="Low Stock Products"
          value={stats.lowStockProducts}
          icon="⚠️"
          color="bg-red-500"
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="bg-blue-500"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className={`grid grid-cols-1 gap-4 ${isSuperAdmin ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
            {isSuperAdmin && (
              <a 
                href="/admin/merchants" 
                className="block p-6 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-red-900 mb-2">Merchant Management</h3>
                <p className="text-red-700">Manage all merchants, create new stores, and monitor platform activity.</p>
              </a>
            )}
            
            <a 
              href="/admin/products" 
              className="block p-6 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Product Management</h3>
              <p className="text-indigo-700">{isSuperAdmin ? 'View all products across merchants' : 'Manage your product catalog, add new products, and update inventory'}.</p>
            </a>
            
            <a 
              href="/admin/orders" 
              className="block p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h3 className="text-lg font-semibold text-green-900 mb-2">Order Management</h3>
              <p className="text-green-700">{isSuperAdmin ? 'Monitor all orders across the platform' : 'View and manage customer orders, update order status and tracking'}.</p>
            </a>
            
            <a 
              href="/admin/users" 
              className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <h3 className="text-lg font-semibold text-purple-900 mb-2">User Management</h3>
              <p className="text-purple-700">{isSuperAdmin ? 'View all users across all merchants' : 'Manage user accounts, block/unblock users, and view order history'}.</p>
            </a>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {!loading && !isSuperAdmin && stats.lowStockProducts > 0 && (
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Attention Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You have {stats.lowStockProducts} product{stats.lowStockProducts !== 1 ? 's' : ''} with low stock. 
                  <a href="/admin/products" className="font-medium underline hover:text-yellow-600 ml-1">
                    Review inventory →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;