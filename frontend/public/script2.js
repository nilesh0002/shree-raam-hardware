// User functions
function loadUserAccount() {
  if (!currentUser) return;
  
  const userOrders = orders.filter(order => order.phone === currentUser.phone);
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
  
  document.getElementById('user-info').innerHTML = `
    <div class="user-info-grid">
      <div class="user-info-item">
        <span class="user-info-label">Name:</span>
        <span class="user-info-value">${currentUser.name}</span>
      </div>
      <div class="user-info-item">
        <span class="user-info-label">Phone:</span>
        <span class="user-info-value">${currentUser.phone}</span>
      </div>
      <div class="user-info-item">
        <span class="user-info-label">Email:</span>
        <span class="user-info-value">${currentUser.email}</span>
      </div>
      <div class="user-info-item">
        <span class="user-info-label">Member Since:</span>
        <span class="user-info-value">${new Date(currentUser.joinDate).toLocaleDateString()}</span>
      </div>
      <div class="user-info-item">
        <span class="user-info-label">Account Status:</span>
        <span class="user-info-value status-active">Active</span>
      </div>
    </div>
  `;
  
  document.getElementById('user-stats').innerHTML = `
    <div class="user-stats-grid">
      <div class="stat-card">
        <div class="stat-number">${userOrders.length}</div>
        <div class="stat-label">Total Orders</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">₹${totalSpent.toLocaleString()}</div>
        <div class="stat-label">Total Spent</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${wishlist.length}</div>
        <div class="stat-label">Wishlist Items</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${userOrders.filter(o => o.status === 'Delivered').length}</div>
        <div class="stat-label">Completed Orders</div>
      </div>
    </div>
  `;
}

function loadUserOrders() {
  const userOrders = orders.filter(order => order.phone === currentUser.phone);
  const ordersDiv = document.getElementById('user-orders');
  
  if (userOrders.length === 0) {
    ordersDiv.innerHTML = `
      <div class="empty-orders">
        <div class="empty-orders-icon">📦</div>
        <h3>No orders yet</h3>
        <p>Start shopping to see your orders here!</p>
        <button class="btn" onclick="showSection('home')">Start Shopping</button>
      </div>
    `;
    return;
  }
  
  ordersDiv.innerHTML = userOrders.map(order => `
    <div class="order-item">
      <div class="order-header">
        <div class="order-info">
          <div class="order-id">Order #${order.id}</div>
          <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
        </div>
        <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
      </div>
      <div class="order-details">
        <div class="order-items">
          <strong>Items:</strong> ${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
        </div>
        <div class="order-total"><strong>Total: ₹${order.total.toLocaleString()}</strong></div>
        <div class="order-address"><strong>Address:</strong> ${order.address}</div>
        ${order.paymentMethod ? `<div class="order-payment"><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</div>` : ''}
      </div>
      <div class="order-actions">
        ${order.status === 'Pending' ? `<button class="btn btn-danger btn-sm" onclick="cancelOrder('${order.id}')">Cancel Order</button>` : ''}
        <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">View Details</button>
        ${order.status === 'Delivered' ? `<button class="btn btn-warning btn-sm" onclick="reorderItems('${order.id}')">Reorder</button>` : ''}
      </div>
    </div>
  `).join('');
}

function loadUserAddresses() {
  const addressesDiv = document.getElementById('user-addresses');
  const addresses = currentUser.addresses || [];
  
  if (addresses.length === 0) {
    addressesDiv.innerHTML = `
      <div class="empty-addresses">
        <div class="empty-addresses-icon">📍</div>
        <h3>No saved addresses</h3>
        <p>Add your first address for faster checkout!</p>
      </div>
    `;
    return;
  }
  
  addressesDiv.innerHTML = addresses.map((address, index) => `
    <div class="address-card ${address.default ? 'default' : ''}">
      <div class="address-header">
        <div class="address-label">${address.label}</div>
        ${address.default ? '<span class="default-badge">Default</span>' : ''}
      </div>
      <div class="address-content">
        <p>${address.address}</p>
        ${address.phone ? `<p><strong>Phone:</strong> ${address.phone}</p>` : ''}
      </div>
      <div class="address-actions">
        <button class="btn btn-secondary btn-sm" onclick="editAddress(${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAddress(${index})">Delete</button>
        ${!address.default ? `<button class="btn btn-sm" onclick="setDefaultAddress(${index})">Set Default</button>` : ''}
      </div>
    </div>
  `).join('');
}

function editProfile() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Profile</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <form id="edit-profile-form">
        <div class="form-group">
          <label>Full Name:</label>
          <input type="text" id="edit-name" value="${currentUser.name}" required>
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" id="edit-email" value="${currentUser.email}" required>
        </div>
        <div class="form-group">
          <label>Phone:</label>
          <input type="tel" id="edit-phone" value="${currentUser.phone}" readonly>
          <small>Phone number cannot be changed</small>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn">Save Changes</button>
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  
  document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    currentUser.name = document.getElementById('edit-name').value;
    currentUser.email = document.getElementById('edit-email').value;
    
    // Update in customers array
    const customerIndex = customers.findIndex(c => c.phone === currentUser.phone);
    if (customerIndex > -1) {
      customers[customerIndex] = {...customers[customerIndex], ...currentUser};
    }
    
    loadUserAccount();
    modal.remove();
    showNotification('Profile updated successfully!', 'success');
  });
}

function addNewAddress() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Add New Address</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <form id="add-address-form">
        <div class="form-group">
          <label>Address Label:</label>
          <input type="text" id="address-label" placeholder="Home, Office, etc." required>
        </div>
        <div class="form-group">
          <label>Full Address:</label>
          <textarea id="address-full" rows="3" placeholder="Enter complete address" required></textarea>
        </div>
        <div class="form-group">
          <label>Phone Number:</label>
          <input type="tel" id="address-phone" placeholder="Contact number for delivery">
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="address-default"> Set as default address
          </label>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn">Add Address</button>
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  
  document.getElementById('add-address-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const newAddress = {
      label: document.getElementById('address-label').value,
      address: document.getElementById('address-full').value,
      phone: document.getElementById('address-phone').value,
      default: document.getElementById('address-default').checked
    };
    
    if (!currentUser.addresses) currentUser.addresses = [];
    
    // If setting as default, remove default from others
    if (newAddress.default) {
      currentUser.addresses.forEach(addr => addr.default = false);
    }
    
    currentUser.addresses.push(newAddress);
    
    // Update in customers array
    const customerIndex = customers.findIndex(c => c.phone === currentUser.phone);
    if (customerIndex > -1) {
      customers[customerIndex] = {...customers[customerIndex], ...currentUser};
    }
    
    loadUserAddresses();
    modal.remove();
    showNotification('Address added successfully!', 'success');
  });
}

function editAddress(index) {
  const address = currentUser.addresses[index];
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Address</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <form id="edit-address-form">
        <div class="form-group">
          <label>Address Label:</label>
          <input type="text" id="edit-address-label" value="${address.label}" required>
        </div>
        <div class="form-group">
          <label>Full Address:</label>
          <textarea id="edit-address-full" rows="3" required>${address.address}</textarea>
        </div>
        <div class="form-group">
          <label>Phone Number:</label>
          <input type="tel" id="edit-address-phone" value="${address.phone || ''}">
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="edit-address-default" ${address.default ? 'checked' : ''}> Set as default address
          </label>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn">Save Changes</button>
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  
  document.getElementById('edit-address-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const isDefault = document.getElementById('edit-address-default').checked;
    
    // If setting as default, remove default from others
    if (isDefault) {
      currentUser.addresses.forEach(addr => addr.default = false);
    }
    
    currentUser.addresses[index] = {
      label: document.getElementById('edit-address-label').value,
      address: document.getElementById('edit-address-full').value,
      phone: document.getElementById('edit-address-phone').value,
      default: isDefault
    };
    
    // Update in customers array
    const customerIndex = customers.findIndex(c => c.phone === currentUser.phone);
    if (customerIndex > -1) {
      customers[customerIndex] = {...customers[customerIndex], ...currentUser};
    }
    
    loadUserAddresses();
    modal.remove();
    showNotification('Address updated successfully!', 'success');
  });
}

function deleteAddress(index) {
  if (confirm('Are you sure you want to delete this address?')) {
    currentUser.addresses.splice(index, 1);
    
    // Update in customers array
    const customerIndex = customers.findIndex(c => c.phone === currentUser.phone);
    if (customerIndex > -1) {
      customers[customerIndex] = {...customers[customerIndex], ...currentUser};
    }
    
    loadUserAddresses();
    showNotification('Address deleted successfully!', 'success');
  }
}

function setDefaultAddress(index) {
  currentUser.addresses.forEach((addr, i) => {
    addr.default = i === index;
  });
  
  // Update in customers array
  const customerIndex = customers.findIndex(c => c.phone === currentUser.phone);
  if (customerIndex > -1) {
    customers[customerIndex] = {...customers[customerIndex], ...currentUser};
  }
  
  loadUserAddresses();
  showNotification('Default address updated!', 'success');
}

function cancelOrder(orderId) {
  if (confirm('Are you sure you want to cancel this order?')) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'Cancelled';
      
      // Restore stock
      order.items.forEach(item => {
        const product = products.find(p => p.name === item.name);
        if (product) {
          product.stock += item.quantity;
        }
      });
      
      loadUserOrders();
      loadProducts(); // Refresh to show updated stock
      showNotification('Order cancelled successfully', 'success');
    }
  }
}

function reorderItems(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.items.forEach(item => {
      const product = products.find(p => p.name === item.name);
      if (product && product.stock >= item.quantity) {
        const existingItem = cart.find(cartItem => cartItem._id === product._id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          cart.push({...product, quantity: item.quantity});
        }
      }
    });
    
    updateCartDisplay();
    saveCartToStorage();
    showNotification('Items added to cart for reorder!', 'success');
    showSection('cart');
  }
}

function viewOrderDetails(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Order Details - #${order.id}</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <div class="order-details-content">
        <div class="order-status-section">
          <h3>Order Status</h3>
          <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
          <p>Order placed on ${new Date(order.date).toLocaleDateString()}</p>
        </div>
        
        <div class="order-items-section">
          <h3>Items Ordered</h3>
          ${order.items.map(item => `
            <div class="order-item-detail">
              <span>${item.name} × ${item.quantity}</span>
              <span>₹${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="order-summary-section">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Total Amount:</span>
            <span>₹${order.total.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>Payment Method:</span>
            <span>${(order.paymentMethod || 'COD').toUpperCase()}</span>
          </div>
        </div>
        
        <div class="delivery-section">
          <h3>Delivery Address</h3>
          <p>${order.address}</p>
          ${order.specialInstructions ? `<p><strong>Special Instructions:</strong> ${order.specialInstructions}</p>` : ''}
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Continue with admin functions and form handlers...