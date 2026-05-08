import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="card">
      <h3>System Categories</h3>
      <div className="table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Category ID</th>
              <th>Category Name</th>
            </tr>
          </thead>
          <tbody>
            {categories && categories.length > 0 ? categories.map((cat) => (
              <tr key={cat.CategoryID}>
                <td>{cat.CategoryID}</td>
                <td style={{ fontWeight: 600 }}>{cat.CategoryName}</td>
              </tr>
            )) : (
              <tr><td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>No categories available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
