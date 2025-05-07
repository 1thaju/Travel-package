import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/adminApi';

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

  const fetchPackages = async () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    try {
      const res = await API.get(`/travel-packages?${params.toString()}`);
      setPackages(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error fetching packages:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
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
