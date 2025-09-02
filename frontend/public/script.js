// Products data with enhanced details
const products = [
  { _id: '1', name: 'Professional Hammer', category: 'Tools', price: 250, stock: 50, image: 'hammer.jpg', description: 'Heavy-duty steel hammer with ergonomic grip for construction work', rating: 4.8, reviews: 124 },
  { _id: '2', name: 'Screwdriver Set Pro', category: 'Tools', price: 180, stock: 30, image: 'screwdriver.jpg', description: 'Complete 12-piece set of Phillips and flathead screwdrivers with magnetic tips', rating: 4.6, reviews: 89 },
  { _id: '3', name: 'Electric Drill Machine', category: 'Power Tools', price: 2500, stock: 15, image: 'drill.jpg', description: 'High-power 800W electric drill with 20 bits and carrying case', rating: 4.9, reviews: 156 },
  { _id: '4', name: 'Premium Paint Brush', category: 'Painting', price: 45, stock: 100, image: 'brush.jpg', description: 'Professional quality synthetic bristle brush for smooth finish', rating: 4.4, reviews: 67 },
  { _id: '5', name: 'Portland Cement 50kg', category: 'Construction', price: 350, stock: 25, image: 'cement.jpg', description: 'Premium quality OPC 53 grade cement for construction projects', rating: 4.7, reviews: 203 },
  { _id: '6', name: 'Steel Rod TMT 12mm', category: 'Construction', price: 65, stock: 200, image: 'rod.jpg', description: 'High-grade TMT steel reinforcement rod with superior strength', rating: 4.5, reviews: 178 }
];

// Global state
let cart = [];
let currentUser = null;
let isAdmin = false;
let orders = [];
let customers = [];
let filteredProducts = [...products];
let wishlist = [];

// Navigation functions
function showSection(sectionName) {
  document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
  document.getElementById(sectionName).classList.remove('hidden');
  
  if (sectionName === 'account' && !currentUser) {
    showSection('login');
    showNotification('Please login to access your account', 'error');
    return;
  }
  
  if (sectionName === 'account') {
    loadUserAccount();
    showAccountTab('profile');
  }
  
  if (sectionName === 'wishlist' && !currentUser) {
    showSection('login');
    showNotification('Please login to view your wishlist', 'error');
    return;
  }
  
  if (sectionName === 'wishlist') {
    loadWishlist();
  }
}

function showAccountTab(tabName) {
  document.querySelectorAll('#account .tab').forEach(tab => tab.classList.remove('active'));
  const tabIndex = tabName === 'profile' ? 1 : tabName === 'orders' ? 2 : tabName === 'addresses' ? 3 : 4;
  document.querySelector(`#account .tab:nth-child(${tabIndex})`).classList.add('active');
  
  document.querySelectorAll('#account > div:not(.tabs)').forEach(div => div.classList.add('hidden'));
  document.getElementById(`account-${tabName}`).classList.remove('hidden');
  
  if (tabName === 'orders') loadUserOrders();
  if (tabName === 'addresses') loadUserAddresses();
  if (tabName === 'wishlist') loadUserWishlist();
}

function showAdminTab(tabName) {
  document.querySelectorAll('#admin-dashboard .tab').forEach(tab => tab.classList.remove('active'));
  const tabIndex = tabName === 'orders' ? 1 : tabName === 'customers' ? 2 : tabName === 'products' ? 3 : 4;
  document.querySelector(`#admin-dashboard .tab:nth-child(${tabIndex})`).classList.add('active');
  
  document.querySelectorAll('#admin-dashboard > div:not(.tabs):not(.admin-stats):not(.admin-actions)').forEach(div => div.classList.add('hidden'));
  document.getElementById(`admin-${tabName}`).classList.remove('hidden');
  
  if (tabName === 'orders') loadOrders();
  if (tabName === 'customers') loadCustomers();
  if (tabName === 'products') loadProductsManagement();
  if (tabName === 'analytics') loadAnalytics();
}

// Product functions
function loadProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = filteredProducts.map(product => `
    <div class="product-card" onclick="viewProduct('${product._id}')">
      <div class="product-image">
        <div class="product-badge ${product.stock < 20 ? 'low-stock' : 'in-stock'}">
          ${product.stock < 20 ? '⚠️ Low Stock' : '✅ In Stock'}
        </div>
        <button class="wishlist-btn ${wishlist.includes(product._id) ? 'active' : ''}" 
                onclick="event.stopPropagation(); toggleWishlist('${product._id}')">
          ${wishlist.includes(product._id) ? '❤️' : '🤍'}
        </button>
        <div class="product-image-placeholder">
          <span class="product-icon">${getProductIcon(product.category)}</span>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="category">${product.category}</p>
        <p class="description">${product.description}</p>
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
          <span class="rating-text">${product.rating} (${product.reviews})</span>
        </div>
        <div class="price">₹${product.price.toLocaleString()}</div>
        <p class="stock ${product.stock < 20 ? 'low-stock' : ''}">
          ${product.stock} units available
        </p>
        <div class="quantity-controls" onclick="event.stopPropagation()">
          <button class="quantity-btn" onclick="changeQuantity('${product._id}', -1)">-</button>
          <input type="number" class="quantity-input" id="qty-${product._id}" value="1" min="1" max="${product.stock}">
          <button class="quantity-btn" onclick="changeQuantity('${product._id}', 1)">+</button>
        </div>
        <div class="product-actions" onclick="event.stopPropagation()">
          <button class="btn ${product.stock === 0 ? 'btn-disabled' : ''}" 
                  onclick="addToCart('${product._id}')" 
                  ${product.stock === 0 ? 'disabled' : ''}>
            ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button class="btn btn-secondary" onclick="buyNow('${product._id}')">Buy Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

function getProductIcon(category) {
  const icons = {
    'Tools': '🔨',
    'Power Tools': '⚡',
    'Painting': '🎨',
    'Construction': '🏗️'
  };
  return icons[category] || '🔧';
}

function searchProducts(query) {
  if (!query.trim()) {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  loadProducts();
  updateSearchResults(query, filteredProducts.length);
}

function updateSearchResults(query, count) {
  const resultsDiv = document.getElementById('search-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = query ? `<div class="search-result-text">Found ${count} products for "${query}"</div>` : '';
  }
}

function filterByCategory(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  if (category === 'all') {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(product => product.category === category);
  }
  loadProducts();
}

function sortProducts(sortBy) {
  switch(sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      filteredProducts = [...products];
  }
  loadProducts();
}

function changeQuantity(productId, change) {
  const input = document.getElementById(`qty-${productId}`);
  if (!input) return;
  
  const newValue = parseInt(input.value) + change;
  const product = products.find(p => p._id === productId);
  
  if (newValue >= 1 && newValue <= product.stock) {
    input.value = newValue;
  }
}

// Cart functions
function addToCart(productId) {
  const product = products.find(p => p._id === productId);
  const quantity = parseInt(document.getElementById(`qty-${productId}`).value) || 1;
  const existingItem = cart.find(item => item._id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({...product, quantity});
  }
  
  updateCartDisplay();
  showNotification(`${product.name} (${quantity}) added to cart! 🛒`, 'success');
}

function buyNow(productId) {
  addToCart(productId);
  showSection('checkout');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item._id !== productId);
  updateCartDisplay();
  showNotification('Item removed from cart', 'info');
}

function updateCartQuantity(productId, newQuantity) {
  const item = cart.find(item => item._id === productId);
  if (item && newQuantity > 0) {
    item.quantity = newQuantity;
    updateCartDisplay();
  }
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    updateCartDisplay();
    showNotification('Cart cleared', 'info');
  }
}

function updateCartDisplay() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Start shopping to add items to your cart!</p>
        <button class="btn" onclick="showSection('home')">Continue Shopping</button>
      </div>
    `;
    cartTotal.innerHTML = '<div class="total-amount">Total: ₹0</div>';
    checkoutBtn.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-image">
          <span class="item-icon">${getProductIcon(item.category)}</span>
        </div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="item-price">₹${item.price.toLocaleString()} each</p>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateCartQuantity('${item._id}', ${item.quantity - 1})">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartQuantity('${item._id}', ${item.quantity + 1})">+</button>
          </div>
          <p class="item-subtotal"><strong>Subtotal: ₹${(item.price * item.quantity).toLocaleString()}</strong></p>
        </div>
        <div class="cart-item-actions">
          <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item._id}')">Remove</button>
        </div>
      </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 1000 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + delivery + tax;
    
    cartTotal.innerHTML = `
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal (${totalItems} items):</span>
          <span>₹${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span>Delivery:</span>
          <span>${delivery === 0 ? 'FREE' : '₹' + delivery}</span>
        </div>
        <div class="summary-row">
          <span>GST (18%):</span>
          <span>₹${tax.toLocaleString()}</span>
        </div>
        <div class="summary-row total-row">
          <span><strong>Total:</strong></span>
          <span><strong>₹${total.toLocaleString()}</strong></span>
        </div>
        ${subtotal > 1000 ? '<div class="free-delivery-msg">🎉 You saved ₹50 on delivery!</div>' : '<div class="delivery-msg">Add ₹' + (1000 - subtotal) + ' more for free delivery</div>'}
      </div>
    `;
    checkoutBtn.style.display = 'block';
  }
  
  updateCheckoutSummary();
}

function updateCheckoutSummary() {
  const summary = document.getElementById('checkout-summary');
  if (!summary) return;
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 1000 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + delivery + tax;
  
  summary.innerHTML = `
    <div class="checkout-summary">
      <h3>📋 Order Summary</h3>
      <div class="order-items">
        ${cart.map(item => `
          <div class="order-item-summary">
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>₹${subtotal.toLocaleString()}</span>
        </div>
        <div class="total-row">
          <span>Delivery:</span>
          <span>${delivery === 0 ? 'FREE' : '₹' + delivery}</span>
        </div>
        <div class="total-row">
          <span>GST (18%):</span>
          <span>₹${tax.toLocaleString()}</span>
        </div>
        <div class="total-row final-total">
          <span><strong>Total:</strong></span>
          <span><strong>₹${total.toLocaleString()}</strong></span>
        </div>
      </div>
    </div>
  `;
}

// Wishlist functions
function toggleWishlist(productId) {
  if (!currentUser) {
    showNotification('Please login to use wishlist', 'error');
    return;
  }
  
  const index = wishlist.indexOf(productId);
  const product = products.find(p => p._id === productId);
  
  if (index > -1) {
    wishlist.splice(index, 1);
    showNotification(`${product.name} removed from wishlist`, 'info');
  } else {
    wishlist.push(productId);
    showNotification(`${product.name} added to wishlist ❤️`, 'success');
  }
  
  loadProducts(); // Refresh to update wishlist buttons
}

function loadWishlist() {
  const wishlistDiv = document.getElementById('wishlist-items');
  if (wishlist.length === 0) {
    wishlistDiv.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">❤️</div>
        <h3>Your wishlist is empty</h3>
        <p>Add products you love to your wishlist!</p>
        <button class="btn" onclick="showSection('home')">Start Shopping</button>
      </div>
    `;
    return;
  }
  
  const wishlistProducts = products.filter(p => wishlist.includes(p._id));
  wishlistDiv.innerHTML = wishlistProducts.map(product => `
    <div class="wishlist-item">
      <div class="wishlist-item-image">
        <span class="item-icon">${getProductIcon(product.category)}</span>
      </div>
      <div class="wishlist-item-details">
        <h4>${product.name}</h4>
        <p class="category">${product.category}</p>
        <div class="price">₹${product.price.toLocaleString()}</div>
        <p class="stock ${product.stock < 20 ? 'low-stock' : ''}">
          ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>
      <div class="wishlist-item-actions">
        <button class="btn" onclick="addToCart('${product._id}')" ${product.stock === 0 ? 'disabled' : ''}>
          Add to Cart
        </button>
        <button class="btn btn-danger" onclick="toggleWishlist('${product._id}')">Remove</button>
      </div>
    </div>
  `).join('');
}

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
        <div class="stat-label">Completed</div>
      </div>
    </div>
  `;
}

function loadUserOrders() {
  const userOrders = orders.filter(order => order.phone === currentUser.phone);
  const ordersDiv = document.getElementById('user-orders');
  
  if (userOrders.length === 0) {
    ordersDiv.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
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
      </div>
      <div class="order-actions">
        ${order.status === 'Pending' ? `<button class="btn btn-danger btn-sm" onclick="cancelOrder('${order.id}')">Cancel</button>` : ''}
        <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">Details</button>
      </div>
    </div>
  `).join('');
}

function loadUserAddresses() {
  const addressesDiv = document.getElementById('user-addresses');
  const addresses = currentUser.addresses || [];
  
  if (addresses.length === 0) {
    addressesDiv.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📍</div>
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
      </div>
      <div class="address-actions">
        <button class="btn btn-secondary btn-sm" onclick="editAddress(${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAddress(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

function loadUserWishlist() {
  loadWishlist();
}

// Admin functions
function loadOrders() {
  const ordersList = document.getElementById('orders-list');
  if (orders.length === 0) {
    ordersList.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><h3>No orders yet</h3></div>';
    return;
  }
  
  ordersList.innerHTML = orders.map(order => `
    <div class="order-item">
      <div class="order-header">
        <div class="order-info">
          <div class="order-id">Order #${order.id}</div>
          <div class="order-customer">${order.customerName} - ${order.phone}</div>
          <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
        </div>
        <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
      </div>
      <div class="order-details">
        <p><strong>Items:</strong> ${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
        <p><strong>Total:</strong> ₹${order.total.toLocaleString()}</p>
        <p><strong>Address:</strong> ${order.address}</p>
      </div>
      <div class="order-actions">
        <select onchange="updateOrderStatus('${order.id}', this.value)">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
    </div>
  `).join('');
}

function loadCustomers() {
  const customersList = document.getElementById('customers-list');
  if (customers.length === 0) {
    customersList.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><h3>No customers yet</h3></div>';
    return;
  }
  
  customersList.innerHTML = customers.map(customer => `
    <div class="customer-item">
      <h4>${customer.name}</h4>
      <p><strong>Phone:</strong> ${customer.phone}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Orders:</strong> ${customer.orderCount || 0}</p>
      <p><strong>Total Spent:</strong> ₹${orders.filter(o => o.phone === customer.phone).reduce((sum, order) => sum + order.total, 0).toLocaleString()}</p>
    </div>
  `).join('');
}

function loadProductsManagement() {
  const productsDiv = document.getElementById('products-management');
  productsDiv.innerHTML = products.map(product => `
    <div class="product-management-item">
      <h4>${product.name}</h4>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> ₹${product.price.toLocaleString()}</p>
      <p><strong>Stock:</strong> ${product.stock} units</p>
      <div class="product-actions">
        <button class="btn btn-warning btn-sm" onclick="updateStock('${product._id}')">Update Stock</button>
      </div>
    </div>
  `).join('');
}

function loadAnalytics() {
  const analyticsDiv = document.getElementById('analytics-content');
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  analyticsDiv.innerHTML = `
    <div class="analytics-stats">
      <div class="stat-card">
        <div class="stat-number">₹${avgOrderValue.toFixed(0)}</div>
        <div class="stat-label">Avg Order Value</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${orders.filter(o => o.status === 'Delivered').length}</div>
        <div class="stat-label">Completed Orders</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${orders.filter(o => o.status === 'Pending').length}</div>
        <div class="stat-label">Pending Orders</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${Math.round((orders.filter(o => o.status === 'Delivered').length / Math.max(orders.length, 1)) * 100)}%</div>
        <div class="stat-label">Success Rate</div>
      </div>
    </div>
  `;
}

function updateOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    loadOrders();
    updateAdminStats();
    showNotification(`Order #${orderId} status updated to ${newStatus}`, 'success');
  }
}

function updateAdminStats() {
  document.getElementById('total-orders').textContent = orders.length;
  document.getElementById('total-revenue').textContent = '₹' + orders.reduce((sum, order) => sum + order.total, 0).toLocaleString();
  document.getElementById('total-customers').textContent = customers.length;
}

function adminLogout() {
  isAdmin = false;
  showSection('home');
  showNotification('Admin logged out successfully', 'info');
}

// Utility functions
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function updateUserInterface() {
  const loginBtn = document.getElementById('login-btn');
  const accountBtn = document.getElementById('account-btn');
  const wishlistBtn = document.getElementById('wishlist-btn');
  
  if (currentUser) {
    loginBtn.textContent = '🚪 Logout';
    loginBtn.onclick = () => logout();
    accountBtn.style.display = 'inline-block';
    wishlistBtn.style.display = 'inline-block';
  } else {
    loginBtn.textContent = '🔑 Login';
    loginBtn.onclick = () => showSection('login');
    accountBtn.style.display = 'none';
    wishlistBtn.style.display = 'none';
  }
}

function logout() {
  currentUser = null;
  wishlist = [];
  updateUserInterface();
  showSection('home');
  showNotification('Logged out successfully', 'info');
}

// Form handlers
document.addEventListener('DOMContentLoaded', function() {
  // Checkout form
  document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const email = document.getElementById('customer-email').value;
    const address = document.getElementById('customer-address').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const specialInstructions = document.getElementById('special-instructions').value;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 1000 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + delivery + tax;
    
    const order = {
      id: 'ORD' + Date.now(),
      customerName: name,
      phone: phone,
      email: email,
      address: address,
      items: [...cart],
      total: total,
      status: 'Pending',
      date: new Date().toISOString(),
      paymentMethod: paymentMethod,
      specialInstructions: specialInstructions
    };
    
    orders.push(order);
    
    if (!customers.find(c => c.phone === phone)) {
      customers.push({ 
        name, 
        phone, 
        email, 
        orderCount: 1,
        joinDate: new Date().toISOString(),
        addresses: []
      });
    } else {
      const customer = customers.find(c => c.phone === phone);
      customer.orderCount = (customer.orderCount || 0) + 1;
    }
    
    cart.forEach(item => {
      const product = products.find(p => p._id === item._id);
      if (product) {
        product.stock -= item.quantity;
      }
    });
    
    showNotification(`Order placed successfully! 🎉 Order ID: ${order.id}`, 'success');
    
    cart = [];
    updateCartDisplay();
    loadProducts();
    showSection('home');
  });

  // Login form
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    
    const user = customers.find(c => c.phone === phone);
    if (user) {
      currentUser = user;
      wishlist = []; // Load user's wishlist here
      updateUserInterface();
      showNotification(`Welcome back, ${user.name}! 👋`, 'success');
      showSection('home');
    } else {
      showNotification('Invalid credentials. Please register first.', 'error');
    }
  });

  // Register form
  document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }
    
    if (customers.find(c => c.phone === phone)) {
      showNotification('Phone number already registered!', 'error');
      return;
    }
    
    const newUser = { 
      name, 
      phone, 
      email, 
      password,
      orderCount: 0,
      joinDate: new Date().toISOString(),
      addresses: []
    };
    customers.push(newUser);
    currentUser = newUser;
    
    updateUserInterface();
    showNotification(`Account created successfully! Welcome ${name}! 🎉`, 'success');
    showSection('home');
  });

  // Admin login form
  document.getElementById('admin-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === 'admin' && password === 'shree@123') {
      isAdmin = true;
      updateAdminStats();
      showSection('admin-dashboard');
      showNotification('Admin login successful! 🔐', 'success');
    } else {
      showNotification('Invalid admin credentials!', 'error');
    }
  });

  // Initialize
  loadProducts();
  updateCartDisplay();
  updateUserInterface();
  
  // Add demo data
  setTimeout(() => {
    customers.push(
      { name: 'John Doe', phone: '9876543210', email: 'john@example.com', orderCount: 2, joinDate: '2024-01-15', addresses: [] },
      { name: 'Jane Smith', phone: '9876543211', email: 'jane@example.com', orderCount: 1, joinDate: '2024-02-01', addresses: [] }
    );
    
    orders.push(
      {
        id: 'ORD1704067200000',
        customerName: 'John Doe',
        phone: '9876543210',
        address: '123 Main St, City',
        items: [{name: 'Professional Hammer', quantity: 2, price: 250}],
        total: 550,
        status: 'Delivered',
        date: '2024-01-15T10:00:00.000Z',
        paymentMethod: 'cod'
      },
      {
        id: 'ORD1706745600000',
        customerName: 'Jane Smith',
        phone: '9876543211',
        address: '456 Oak Ave, Town',
        items: [{name: 'Electric Drill Machine', quantity: 1, price: 2500}],
        total: 2500,
        status: 'Shipped',
        date: '2024-02-01T14:30:00.000Z',
        paymentMethod: 'online'
      }
    );
    
    updateAdminStats();
  }, 1000);
});