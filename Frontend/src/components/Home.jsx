import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authFetch } = useAuth();
  const navigate = useNavigate();

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
        headers: { 'Accept': 'application/json' },
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
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    setSearchParams(prev => ({ ...prev, sortOrder: e.target.value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ...the rest of your UI code (search, listing, etc.) */}
      {/* You can copy the rest of the component from your previous message */}
    </div>
  );
}
