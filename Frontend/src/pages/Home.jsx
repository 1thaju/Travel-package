import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/adminApi';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', startDate: '', endDate: '', sort: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  const fetchPackages = async () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    try {
      const res = await API.get(`/travel-packages?${params.toString()}`);
      setPackages(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load packages');
      console.error('Error fetching packages:', err, err.response?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPackages();
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Travel Package</h1>
      <form className="flex flex-wrap gap-4 mb-6" onSubmit={handleSearch}>
        <input name="from" value={filters.from} onChange={handleChange} placeholder="From" className="p-2 border rounded" />
        <input name="to" value={filters.to} onChange={handleChange} placeholder="To" className="p-2 border rounded" />
        <input name="startDate" type="date" value={filters.startDate} onChange={handleChange} className="p-2 border rounded" />
        <input name="endDate" type="date" value={filters.endDate} onChange={handleChange} className="p-2 border rounded" />
        <select name="sort" value={filters.sort} onChange={handleChange} className="p-2 border rounded">
          <option value="">Sort by</option>
          <option value="basePrice:asc">Price: Low to High</option>
          <option value="basePrice:desc">Price: High to Low</option>
        </select>
        <button type="submit" className="btn-primary">Search</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.length === 0 && <div>No packages found.</div>}
          {packages.map(pkg => (
            <div key={pkg._id} className="bg-white rounded shadow p-4 flex flex-col">
              <div className="font-bold text-lg mb-2">{pkg.from} → {pkg.to}</div>
              <div className="mb-1">{new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}</div>
              <div className="mb-1">Base Price: <span className="font-semibold">${pkg.basePrice}</span></div>
              <div className="mb-2">Included: {pkg.includedServices.food && 'Food'} {pkg.includedServices.accommodation && 'Accommodation'}</div>
              <a href={`/packages/${pkg._id}`} className="btn-primary mt-auto text-center">View Details</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 