import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LowStockAlert = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/products/low-stock`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setLowStockProducts(response.data.products);
    } catch (err) {
      setError('Failed to fetch low stock products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  if (loading) return null;
  if (error || lowStockProducts.length === 0) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Low Stock Alert ({lowStockProducts.length} products)
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>The following products are running low on stock:</p>
            <ul className="list-disc list-inside mt-1">
              {lowStockProducts.slice(0, 3).map((product) => (
                <li key={product.id}>
                  {product.name} - {product.stock} left
                  {product.stock === 0 && <span className="text-red-600 font-semibold"> (OUT OF STOCK)</span>}
                </li>
              ))}
              {lowStockProducts.length > 3 && (
                <li>...and {lowStockProducts.length - 3} more products</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;