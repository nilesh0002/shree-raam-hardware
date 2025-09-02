import React, { useState, useEffect } from 'react';

function UserAccount({ user, onBack, onLogout }) {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ label: 'Home', address: '' });
  const [showAddAddress, setShowAddAddress] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUser();
      fetchOrders();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${user.phone}`);
      if (response.ok) {
        const userData = await response.json();
        setUserDetails(userData);
        setAddresses(userData.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${user.phone}/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addAddress = async () => {
    if (!newAddress.address.trim()) return;
    
    const updatedAddresses = [...addresses, { ...newAddress, isDefault: addresses.length === 0 }];
    
    try {
      await fetch(`http://localhost:5000/api/user/${user.phone}/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      
      setAddresses(updatedAddresses);
      setNewAddress({ label: 'Home', address: '' });
      setShowAddAddress(false);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'PUT'
      });
      fetchOrders();
      alert('Order cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling order:', error);
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

  const canCancelOrder = (order) => {
    return order.status === 'Pending' || order.status === 'Processing';
  };

  if (!user) {
    return (
      <div className="account-container">
        <div className="account-login">
          <h2>👤 My Account</h2>
          <p>Please place an order first to create your account</p>
          <button className="back-btn" onClick={onBack}>🏪 Back to Store</button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <button className="back-btn" onClick={onBack}>← Back to Store</button>
        <h1>👤 My Account</h1>
        <div className="user-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
        </div>
      </div>

      <div className="account-content">
        <div className="addresses-section">
          <div className="section-header">
            <h2>📍 Saved Addresses</h2>
            <button className="add-btn" onClick={() => setShowAddAddress(true)}>+ Add Address</button>
          </div>
          
          {addresses.length === 0 ? (
            <p className="empty-message">No saved addresses</p>
          ) : (
            <div className="addresses-list">
              {addresses.map((addr, index) => (
                <div key={index} className="address-card">
                  <div className="address-label">{addr.label}</div>
                  <div className="address-text">{addr.address}</div>
                  {addr.isDefault && <span className="default-badge">Default</span>}
                </div>
              ))}
            </div>
          )}

          {showAddAddress && (
            <div className="add-address-form">
              <input
                type="text"
                placeholder="Address Label (Home, Office, etc.)"
                value={newAddress.label}
                onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                className="form-input"
              />
              <textarea
                placeholder="Full Address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                className="form-textarea"
              />
              <div className="form-buttons">
                <button className="save-btn" onClick={addAddress}>Save Address</button>
                <button className="cancel-btn" onClick={() => setShowAddAddress(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="orders-section">
          <h2>📦 My Orders</h2>
          {orders.length === 0 ? (
            <p className="empty-message">No orders found</p>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order._id.slice(-6)}</h3>
                      <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                      {canCancelOrder(order) && (
                        <button 
                          className="cancel-order-btn"
                          onClick={() => cancelOrder(order._id)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">Qty: {item.quantity}</span>
                        <span className="item-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="delivery-address">
                      <strong>📍 Delivery Address:</strong>
                      <p>{order.address}</p>
                    </div>
                    <div className="order-total">
                      <strong>Total: ₹{order.total}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAccount;