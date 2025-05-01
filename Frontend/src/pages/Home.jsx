import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  // Search states
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    startDate: '',
    endDate: '',
    sortBy: 'price',
    sortOrder: 'asc'
  });

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const queryString = new URLSearchParams({
        ...searchParams,
        page: 1,
        limit: 10
      }).toString();

      const response = await fetch(`http://localhost:3000/api/travel-packages/search?${queryString}`, {
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch packages');
      }

      setPackages(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSortChange = (e) => {
    setSearchParams(prev => ({
      ...prev,
      sortOrder: e.target.value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
              <input
                type="text"
                id="from"
                name="from"
                value={searchParams.from}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Departure city"
              />
            </div>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
              <input
                type="text"
                id="to"
                name="to"
                value={searchParams.to}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Destination city"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={searchParams.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={searchParams.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label htmlFor="sortOrder" className="text-sm font-medium text-gray-700">Sort by price:</label>
              <select
                id="sortOrder"
                name="sortOrder"
                value={searchParams.sortOrder}
                onChange={handleSortChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search Packages
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading packages...</p>
        </div>
      ) : (
        /* Package Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={pkg.imageUrl}
                alt={pkg.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = '/default-package.jpg';
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>From: {pkg.from}</p>
                  <p>To: {pkg.to}</p>
                  <p>Date: {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">${pkg.price}</span>
                  <button
                    onClick={() => navigate(`/packages/${pkg._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {!loading && packages.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          <p>No travel packages found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 