// Products data
const products = [
  { _id: '1', name: 'Hammer', category: 'Tools', price: 250, stock: 50, image: 'hammer.jpg', description: 'Heavy-duty steel hammer for construction work' },
  { _id: '2', name: 'Screwdriver Set', category: 'Tools', price: 180, stock: 30, image: 'screwdriver.jpg', description: 'Complete set of Phillips and flathead screwdrivers' },
  { _id: '3', name: 'Drill Machine', category: 'Power Tools', price: 2500, stock: 15, image: 'drill.jpg', description: 'High-power electric drill with multiple bits' },
  { _id: '4', name: 'Paint Brush', category: 'Painting', price: 45, stock: 100, image: 'brush.jpg', description: 'Professional quality paint brush for smooth finish' },
  { _id: '5', name: 'Cement (50kg)', category: 'Construction', price: 350, stock: 25, image: 'cement.jpg', description: 'Premium quality cement for construction projects' },
  { _id: '6', name: 'Steel Rod (12mm)', category: 'Construction', price: 65, stock: 200, image: 'rod.jpg', description: 'High-grade steel reinforcement rod' }
];

let cart = [];
let currentUser = null;
let isAdmin = false;
let orders = [];
let customers = [];
let filteredProducts = [...products];

// Show/Hide sections
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
  }
}

function showAccountTab(tabName) {
  document.querySelectorAll('#account .tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`#account .tab:nth-child(${tabName === 'profile' ? 1 : tabName === 'orders' ? 2 : 3})`).classList.add('active');
  
  document.querySelectorAll('#account > div:not(.tabs)').forEach(div => div.classList.add('hidden'));
  document.getElementById(`account-${tabName}`).classList.remove('hidden');
  
  if (tabName === 'orders') loadUserOrders();
  if (tabName === 'addresses') loadUserAddresses();
}

function showAdminTab(tabName) {
  document.querySelectorAll('#admin-dashboard .tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`#admin-dashboard .tab:nth-child(${tabName === 'orders' ? 1 : tabName === 'customers' ? 2 : tabName === 'products' ? 3 : 4})`).classList.add('active');
  
  document.querySelectorAll('#admin-dashboard > div:not(.tabs):not(.admin-stats):not([style])').forEach(div => div.classList.add('hidden'));
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
    <div class="product-card">
      <h3>${product.name}</h3>
      <p><strong>Category:</strong> ${product.category}</p>
      <p class="description">${product.description}</p>
      <div class="price">₹${product.price}</div>
      <p class="stock ${product.stock < 20 ? 'low-stock' : ''}">
        Stock: ${product.stock} units ${product.stock < 20 ? '⚠️' : ''}
      </p>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="changeQuantity('${product._id}', -1)">-</button>
        <input type="number" class="quantity-input" id="qty-${product._id}" value="1" min="1" max="${product.stock}">
        <button class="quantity-btn" onclick="changeQuantity('${product._id}', 1)">+</button>
      </div>
      <button class="btn" onclick="addToCart('${product._id}')" ${product.stock === 0 ? 'disabled' : ''}>
        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  `).join('');
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

function changeQuantity(productId, change) {
  const input = document.getElementById(`qty-${productId}`);
  const newValue = parseInt(input.value) + change;
  const product = products.find(p => p._id === productId);
  
  if (newValue >= 1 && newValue <= product.stock) {
    input.value = newValue;
  }
}

// Cart functions
function addToCart(productId) {
  const product = products.find(p => p._id === productId);
  const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
  const existingItem = cart.find(item => item._id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({...product, quantity});
  }
  
  updateCartDisplay();
  showNotification(`${product.name} (${quantity}) added to cart! 🛒`, 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item._id !== productId);
  updateCartDisplay();
  showNotification('Item removed from cart', 'info');
}

function updateCartQuantity(productId, newQuantity) {
  const item = cart.find(item => item._id === productId);
  if (item) {
    item.quantity = Math.max(1, newQuantity);
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
  
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="info-message">Your cart is empty. Start shopping to add items!</div>';
    cartTotal.textContent = 'Total: ₹0';
    checkoutBtn.style.display = 'none';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>₹${item.price} each</p>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateCartQuantity('${item._id}', ${item.quantity - 1})">-</button>
            <span style="margin: 0 1rem;">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartQuantity('${item._id}', ${item.quantity + 1})">+</button>
          </div>
          <p><strong>Subtotal: ₹${item.price * item.quantity}</strong></p>
        </div>
        <button class="btn btn-danger" onclick="removeFromCart('${item._id}')">Remove</button>
      </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerHTML = `
      <div>Subtotal: ₹${total}</div>
      <div>Delivery: ₹${total > 1000 ? 0 : 50}</div>
      <div style="font-size: 2rem; margin-top: 0.5rem;">Total: ₹${total + (total > 1000 ? 0 : 50)}</div>
      ${total > 1000 ? '<div style="color: #28a745; font-size: 1rem;">🎉 Free delivery on orders above ₹1000!</div>' : ''}
    `;
    checkoutBtn.style.display = 'block';
  }
  
  updateCheckoutSummary();
}

function updateCheckoutSummary() {
  const summary = document.getElementById('checkout-summary');
  if (!summary) return;
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = total > 1000 ? 0 : 50;
  
  summary.innerHTML = `
    <div class="info-message">
      <h3>Order Summary</h3>
      ${cart.map(item => `<p>${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</p>`).join('')}
      <hr>
      <p><strong>Subtotal: ₹${total}</strong></p>
      <p><strong>Delivery: ₹${delivery}</strong></p>
      <p style="font-size: 1.2rem;"><strong>Total: ₹${total + delivery}</strong></p>
    </div>
  `;
}

// User functions
function loadUserAccount() {
  if (!currentUser) return;
  
  document.getElementById('user-info').innerHTML = `
    <p><strong>Name:</strong> ${currentUser.name}</p>
    <p><strong>Phone:</strong> ${currentUser.phone}</p>
    <p><strong>Email:</strong> ${currentUser.email}</p>
    <p><strong>Member Since:</strong> ${currentUser.joinDate || 'Recently'}</p>
  `;
  
  const userOrders = orders.filter(order => order.phone === currentUser.phone);
  document.getElementById('user-stats').innerHTML = `
    <div class="stat-card" style="background: #28a745;">
      <div class="stat-number">${userOrders.length}</div>
      <div>Total Orders</div>
    </div>
    <div class="stat-card" style="background: #007cba;">
      <div class="stat-number">₹${userOrders.reduce((sum, order) => sum + order.total, 0)}</div>
      <div>Total Spent</div>
    </div>
  `;
}

function loadUserOrders() {
  const userOrders = orders.filter(order => order.phone === currentUser.phone);
  const ordersDiv = document.getElementById('user-orders');
  
  if (userOrders.length === 0) {
    ordersDiv.innerHTML = '<div class="info-message">No orders yet. Start shopping!</div>';
    return;
  }
  
  ordersDiv.innerHTML = userOrders.map(order => `
    <div class="order-item">
      <div class="order-header">
        <div>
          <strong>Order #${order.id}</strong>
          <br><small>${new Date(order.date).toLocaleDateString()}</small>
        </div>
        <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
      </div>
      <p><strong>Items:</strong> ${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      ${order.status === 'Pending' ? `<button class="btn btn-danger" onclick="cancelOrder('${order.id}')">Cancel Order</button>` : ''}
    </div>
  `).join('');
}

function loadUserAddresses() {
  const addressesDiv = document.getElementById('user-addresses');
  const addresses = currentUser.addresses || [];
  
  if (addresses.length === 0) {
    addressesDiv.innerHTML = '<div class="info-message">No saved addresses. Add your first address!</div>';
    return;
  }
  
  addressesDiv.innerHTML = addresses.map((address, index) => `
    <div class="address-card ${address.default ? 'default' : ''}">
      <h4>${address.label} ${address.default ? '(Default)' : ''}</h4>
      <p>${address.address}</p>
      <button class="btn btn-secondary" onclick="editAddress(${index})">Edit</button>
      <button class="btn btn-danger" onclick="deleteAddress(${index})">Delete</button>
      ${!address.default ? `<button class="btn" onclick="setDefaultAddress(${index})">Set Default</button>` : ''}
    </div>
  `).join('');
}

// Admin functions
function loadOrders() {
  const ordersList = document.getElementById('orders-list');
  if (orders.length === 0) {
    ordersList.innerHTML = '<div class="info-message">No orders yet</div>';
    return;
  }
  
  ordersList.innerHTML = orders.map(order => `
    <div class="order-item">
      <div class="order-header">
        <div>
          <strong>Order #${order.id}</strong> - ${order.customerName}
          <br><small>${order.phone} | ${new Date(order.date).toLocaleDateString()}</small>
        </div>
        <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
      </div>
      <p><strong>Items:</strong> ${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod || 'COD'}</p>
      ${order.specialInstructions ? `<p><strong>Instructions:</strong> ${order.specialInstructions}</p>` : ''}
      <div style="margin-top: 1rem;">
        <select onchange="updateOrderStatus('${order.id}', this.value)">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
        <button class="btn btn-secondary" onclick="viewOrderDetails('${order.id}')">View Details</button>
      </div>
    </div>
  `).join('');
}

function loadCustomers() {
  const customersList = document.getElementById('customers-list');
  if (customers.length === 0) {
    customersList.innerHTML = '<div class="info-message">No customers yet</div>';
    return;
  }
  
  customersList.innerHTML = customers.map(customer => `
    <div class="order-item">
      <h4>${customer.name}</h4>
      <p><strong>Phone:</strong> ${customer.phone}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Orders:</strong> ${customer.orderCount || 0}</p>
      <p><strong>Total Spent:</strong> ₹${orders.filter(o => o.phone === customer.phone).reduce((sum, order) => sum + order.total, 0)}</p>
      <button class="btn" onclick="viewCustomerOrders('${customer.phone}')">View Orders</button>
    </div>
  `).join('');
}

function loadProductsManagement() {
  const productsDiv = document.getElementById('products-management');
  productsDiv.innerHTML = products.map(product => `
    <div class="order-item">
      <h4>${product.name}</h4>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> ₹${product.price}</p>
      <p><strong>Stock:</strong> ${product.stock} units</p>
      <p><strong>Description:</strong> ${product.description}</p>
      <button class="btn" onclick="editProduct('${product._id}')">Edit</button>
      <button class="btn btn-warning" onclick="updateStock('${product._id}')">Update Stock</button>
      <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
    </div>
  `).join('');
}

function loadAnalytics() {
  const analyticsDiv = document.getElementById('analytics-content');
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  analyticsDiv.innerHTML = `
    <div class="admin-stats">
      <div class="stat-card">
        <div class="stat-number">₹${avgOrderValue.toFixed(0)}</div>
        <div>Avg Order Value</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${orders.filter(o => o.status === 'Delivered').length}</div>
        <div>Completed Orders</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${orders.filter(o => o.status === 'Pending').length}</div>
        <div>Pending Orders</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${Math.round((orders.filter(o => o.status === 'Delivered').length / orders.length) * 100) || 0}%</div>
        <div>Success Rate</div>
      </div>
    </div>
    <div class="info-message">
      <h3>Top Selling Products</h3>
      ${getTopProducts().map(product => `<p>${product.name}: ${product.sold} sold</p>`).join('')}
    </div>
  `;
}

function getTopProducts() {
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    });
  });
  
  return Object.entries(productSales)
    .map(([name, sold]) => ({name, sold}))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
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
  document.getElementById('total-revenue').textContent = '₹' + orders.reduce((sum, order) => sum + order.total, 0);
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
  notification.className = 'notification';
  notification.style.background = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function updateUserInterface() {
  const loginBtn = document.getElementById('login-btn');
  const accountBtn = document.getElementById('account-btn');
  
  if (currentUser) {
    loginBtn.textContent = '🚪 Logout';
    loginBtn.onclick = () => logout();
    accountBtn.style.display = 'block';
  } else {
    loginBtn.textContent = '🔑 Login';
    loginBtn.onclick = () => showSection('login');
    accountBtn.style.display = 'none';
  }
}

function logout() {
  currentUser = null;
  updateUserInterface();
  showSection('home');
  showNotification('Logged out successfully', 'info');
}

// Form handlers
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const email = document.getElementById('customer-email').value;
    const address = document.getElementById('customer-address').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const specialInstructions = document.getElementById('special-instructions').value;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = total > 1000 ? 0 : 50;
    
    const order = {
      id: 'ORD' + Date.now(),
      customerName: name,
      phone: phone,
      email: email,
      address: address,
      items: [...cart],
      total: total + delivery,
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
        joinDate: new Date().toISOString()
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

  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    
    const user = customers.find(c => c.phone === phone);
    if (user) {
      currentUser = user;
      updateUserInterface();
      showNotification(`Welcome back, ${user.name}! 👋`, 'success');
      showSection('home');
    } else {
      showNotification('Invalid credentials. Please register first.', 'error');
    }
  });

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
      { name: 'John Doe', phone: '9876543210', email: 'john@example.com', orderCount: 2, joinDate: '2024-01-15' },
      { name: 'Jane Smith', phone: '9876543211', email: 'jane@example.com', orderCount: 1, joinDate: '2024-02-01' }
    );
    
    orders.push(
      {
        id: 'ORD1704067200000',
        customerName: 'John Doe',
        phone: '9876543210',
        address: '123 Main St, City',
        items: [{name: 'Hammer', quantity: 2, price: 250}],
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
        items: [{name: 'Drill Machine', quantity: 1, price: 2500}],
        total: 2500,
        status: 'Shipped',
        date: '2024-02-01T14:30:00.000Z',
        paymentMethod: 'online'
      }
    );
    
    updateAdminStats();
  }, 1000);
});