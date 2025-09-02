import React, { useState, useEffect } from 'react';
import './App.css';
import Admin from './Admin';
import AdminLogin from './AdminLogin';
import UserAccount from './UserAccount';
import UserLogin from './UserLogin';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [currentView, setCurrentView] = useState('store');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (category = '') => {
    try {
      const url = category ? `http://localhost:5000/api/products?category=${category}` : 'http://localhost:5000/api/products';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product._id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, id: product._id, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const placeOrder = async () => {
    try {
      const orderData = {
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        items: cart,
        total: getTotal()
      };
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        alert('Order placed successfully!');
        setCart([]);
        setShowCheckout(false);
        setCustomerInfo({ name: '', phone: '', address: '' });
        fetchProducts(selectedCategory);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleAccountAccess = () => {
    if (user) {
      setCurrentView('account');
    } else {
      setShowUserLogin(true);
    }
  };

  const handleUserLogin = (userData) => {
    setUser(userData);
    setCurrentView('account');
    setShowUserLogin(false);
  };

  const handleUserLogout = () => {
    setUser(null);
    setCurrentView('store');
  };

  const getProductIcon = (category) => {
    const icons = {
      'Tools': '🔨',
      'Power Tools': '⚡',
      'Painting': '🎨',
      'Construction': '🏗️'
    };
    return icons[category] || '🔧';
  };

  if (currentView === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
    }
    return <Admin onLogout={() => { setIsAdminLoggedIn(false); setCurrentView('store'); }} />;
  }

  if (currentView === 'account') {
    return <UserAccount user={user} onBack={() => setCurrentView('store')} onLogout={handleUserLogout} />;
  }

  if (showUserLogin) {
    return <UserLogin onLogin={handleUserLogin} onBack={() => setShowUserLogin(false)} />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">🔨</div>
          <h1>Shree Raam Hardware</h1>
        </div>
        <p className="tagline">Your trusted hardware store since 1985</p>
      </header>

      <nav className="nav">
        <button className={`nav-button ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}>All Products</button>
        {categories.map(cat => (
          <button key={cat} className={`nav-button ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}>{cat}</button>
        ))}
        <button className="nav-button cart-button" onClick={() => setShowCart(!showCart)}>
          🛒 Cart
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </button>
        <button className="nav-button" onClick={handleAccountAccess}
                style={{background: '#17a2b8', color: 'white'}}>
          {user ? `👤 ${user.name}` : '👤 Login'}
        </button>
        <button 
          className="nav-button" 
          style={{background: currentView === 'admin' ? '#dc3545' : '#6c757d', color: 'white'}}
          onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
        >
          {currentView === 'store' ? '👨💼 Admin' : '🏪 Store'}
        </button>
      </nav>

      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-icon">{getProductIcon(product.category)}</div>
            <h3 className="product-name">{product.name}</h3>
            <span className="product-category">{product.category}</span>
            <div className="product-price">₹{product.price}</div>
            <p className="product-stock">Stock: {product.stock} units</p>
            <button className="add-to-cart-btn" 
                    onClick={() => addToCart(product)} disabled={product.stock === 0}>
              {product.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
            </button>
          </div>
        ))}
      </div>

      {showCart && (
        <div className="cart">
          <div className="cart-header">
            <h3>🛒 Shopping Cart</h3>
            <button className="close-cart-btn" onClick={() => setShowCart(false)}>✕</button>
          </div>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button className="continue-shopping-btn" onClick={() => setShowCart(false)}>Continue Shopping</button>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</div>
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                💰 Total: ₹{getTotal()}
              </div>
              <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
                🚀 Proceed to Checkout
              </button>
            </>
          )}
        </div>
      )}

      {showCheckout && (
        <div className="modal">
          <div className="modal-content">
            <h3>🛒 Checkout</h3>
            <input className="form-input" type="text" placeholder="👤 Full Name" value={customerInfo.name} 
                   onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
            <input className="form-input" type="tel" placeholder="📱 Phone Number" value={customerInfo.phone} 
                   onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
            <textarea className="form-textarea" placeholder="🏠 Delivery Address" value={customerInfo.address} 
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
            <div className="cart-total">💰 Total Amount: ₹{getTotal()}</div>
            <div className="modal-buttons">
              <button className="place-order-btn" onClick={placeOrder}>🚀 Place Order</button>
              <button className="cancel-btn" onClick={() => setShowCheckout(false)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default App;