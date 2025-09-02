import React, { useState, useEffect } from 'react';

function Admin({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'Processing': '#17a2b8',
      'Shipped': '#007bff',
      'Delivered': '#28a745',
      'Cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>🔧 Admin Dashboard - Shree Raam Hardware</h1>
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>📊 Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>💰 Total Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>
        <div className="stat-card">
          <h3>⏳ Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>📦 Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>
      </div>

      <div className="orders-section">
        <h2>📋 Customer Orders</h2>
        <div className="orders-table">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="customer-info">
                <p><strong>👤 Customer:</strong> {order.customerName}</p>
                <p><strong>📱 Phone:</strong> {order.phone}</p>
                <p><strong>🏠 Address:</strong> {order.address}</p>
              </div>

              <div className="order-items">
                <h4>🛒 Items Ordered:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>💰 Total: ₹{order.total}</strong>
                </div>
                <div className="status-section">
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;