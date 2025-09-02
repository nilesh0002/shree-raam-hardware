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
let recentlyViewed = [];

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
    <div class="product-card" onclick="viewProduct('${product._id}')">
      <div class="product-image">
        <div class="product-badge ${product.stock < 20 ? 'low-stock' : 'in-stock'}">
          ${product.stock < 20 ? 'Low Stock' : 'In Stock'}
        </div>
        <button class="wishlist-btn ${wishlist.includes(product._id) ? 'active' : ''}" 
                onclick="event.stopPropagation(); toggleWishlist('${product._id}')">
          ❤️
        </button>
      </div>
      <h3>${product.name}</h3>
      <p class="category"><strong>Category:</strong> ${product.category}</p>
      <p class="description">${product.description}</p>
      <div class="product-rating">
        <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
        <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
      </div>
      <div class="price">₹${product.price.toLocaleString()}</div>
      <p class="stock ${product.stock < 20 ? 'low-stock' : ''}">
        Stock: ${product.stock} units ${product.stock < 20 ? '⚠️' : '✅'}
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
  updateSearchResults(query, filteredProducts.length);
}

function updateSearchResults(query, count) {
  const resultsDiv = document.getElementById('search-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = query ? `Found ${count} products for "${query}"` : '';
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

function viewProduct(productId) {
  const product = products.find(p => p._id === productId);
  if (!recentlyViewed.includes(productId)) {
    recentlyViewed.unshift(productId);
    if (recentlyViewed.length > 5) recentlyViewed.pop();
  }
  
  showProductModal(product);
}

function showProductModal(product) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${product.name}</h2>
        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
      </div>
      <div class="product-details">
        <div class="product-rating">
          <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
          <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
        </div>
        <p class="category"><strong>Category:</strong> ${product.category}</p>
        <p class="description">${product.description}</p>
        <div class="price">₹${product.price.toLocaleString()}</div>
        <p class="stock">Stock: ${product.stock} units available</p>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="changeQuantity('${product._id}', -1)">-</button>
          <input type="number" class="quantity-input" id="modal-qty-${product._id}" value="1" min="1" max="${product.stock}">
          <button class="quantity-btn" onclick="changeQuantity('${product._id}', 1)">+</button>
        </div>
        <div class="modal-actions">
          <button class="btn" onclick="addToCartFromModal('${product._id}')">Add to Cart</button>
          <button class="btn btn-secondary" onclick="buyNowFromModal('${product._id}')">Buy Now</button>
          <button class="btn btn-warning" onclick="toggleWishlist('${product._id}')">
            ${wishlist.includes(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function changeQuantity(productId, change) {
  const input = document.getElementById(`qty-${productId}`) || document.getElementById(`modal-qty-${productId}`);
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
  saveCartToStorage();
}

function addToCartFromModal(productId) {
  const product = products.find(p => p._id === productId);
  const quantity = parseInt(document.getElementById(`modal-qty-${productId}`).value) || 1;
  const existingItem = cart.find(item => item._id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({...product, quantity});
  }
  
  updateCartDisplay();
  showNotification(`${product.name} (${quantity}) added to cart! 🛒`, 'success');
  saveCartToStorage();
  document.querySelector('.modal').remove();
}

function buyNow(productId) {
  addToCart(productId);
  showSection('checkout');
}

function buyNowFromModal(productId) {
  addToCartFromModal(productId);
  showSection('checkout');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item._id !== productId);
  updateCartDisplay();
  showNotification('Item removed from cart', 'info');
  saveCartToStorage();
}

function updateCartQuantity(productId, newQuantity) {
  const item = cart.find(item => item._id === productId);
  if (item && newQuantity > 0) {
    item.quantity = newQuantity;
    updateCartDisplay();
    saveCartToStorage();
  }
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    updateCartDisplay();
    showNotification('Cart cleared', 'info');
    saveCartToStorage();
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
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
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
          <span>Delivery Charges:</span>
          <span>${delivery === 0 ? 'FREE' : '₹' + delivery}</span>
        </div>
        <div class="summary-row">
          <span>GST (18%):</span>
          <span>₹${tax.toLocaleString()}</span>
        </div>
        <div class="summary-row total-row">
          <span>Total Amount:</span>
          <span>₹${total.toLocaleString()}</span>
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
      <h3>Order Summary</h3>
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
          <span>Total:</span>
          <span>₹${total.toLocaleString()}</span>
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
  
  saveWishlistToStorage();
  loadProducts(); // Refresh to update wishlist buttons
}

function loadWishlist() {
  const wishlistDiv = document.getElementById('wishlist-items');
  if (wishlist.length === 0) {
    wishlistDiv.innerHTML = `
      <div class="empty-wishlist">
        <div class="empty-wishlist-icon">❤️</div>
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

function loadUserWishlist() {
  loadWishlist();
}

// Storage functions
function saveCartToStorage() {
  localStorage.setItem('hardwareStore_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem('hardwareStore_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
}

function saveWishlistToStorage() {
  if (currentUser) {
    localStorage.setItem(`hardwareStore_wishlist_${currentUser.phone}`, JSON.stringify(wishlist));
  }
}

function loadWishlistFromStorage() {
  if (currentUser) {
    const savedWishlist = localStorage.getItem(`hardwareStore_wishlist_${currentUser.phone}`);
    if (savedWishlist) {
      wishlist = JSON.parse(savedWishlist);
    }
  }
}

// Continue in next part due to length...