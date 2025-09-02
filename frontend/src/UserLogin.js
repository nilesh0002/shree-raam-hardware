import React, { useState } from 'react';

function UserLogin({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/user/login' : '/api/user/register';
      const payload = isLogin 
        ? { phone: formData.phone, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        if (isLogin) {
          onLogin(data.user);
        } else {
          alert('Account created successfully! Please login.');
          setIsLogin(true);
          setFormData({ name: '', phone: '', email: '', password: '' });
        }
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="user-login-container">
      <div className="user-login-card">
        <div className="user-login-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <div className="login-logo">👤</div>
          <h2>{isLogin ? 'Login to Account' : 'Create Account'}</h2>
          <p>Shree Raam Hardware</p>
        </div>

        <form onSubmit={handleSubmit} className="user-login-form">
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="👤 Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="user-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="📱 Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="user-input"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="📧 Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="user-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleInputChange}
              className="user-input"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="user-login-btn" disabled={loading}>
            {loading ? '⏳ Please wait...' : (isLogin ? '🚀 Login' : '✨ Create Account')}
          </button>
        </form>

        <div className="toggle-form">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="toggle-btn" 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', phone: '', email: '', password: '' });
              }}
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;