import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PackageDetails = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [selected, setSelected] = useState({ food: false, accommodation: false });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      const res = await fetch(`/api/travel-packages/${id}`);
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || 'Package not found');
        setLoading(false);
        return;
      }
      setPkg(data.data || data);
      setSelected({
        food: data.data?.includedServices?.food || false,
        accommodation: data.data?.includedServices?.accommodation || false
      });
      setLoading(false);
    };
    fetchPackage();
  }, [id]);

  useEffect(() => {
    if (!pkg) return;
    let price = pkg.basePrice;
    if (selected.food && !pkg.includedServices.food) price += 100;
    if (selected.accommodation && !pkg.includedServices.accommodation) price += 200;
    setTotal(price);
  }, [pkg, selected]);

  const handleChange = (e) => {
    setSelected({ ...selected, [e.target.name]: e.target.checked });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageId: pkg._id,
          selectedServices: selected,
          totalPrice: total
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      setSuccess('Booking successful!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8 text-red-500">{error}</div>;
  if (!pkg) return null;

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{pkg.from} → {pkg.to}</h1>
      <div className="mb-2">{new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}</div>
      <div className="mb-2">Base Price: <span className="font-semibold">${pkg.basePrice}</span></div>
      <div className="mb-2">Included: {pkg.includedServices.food && 'Food'} {pkg.includedServices.accommodation && 'Accommodation'}</div>
      <form onSubmit={handleBook} className="bg-white p-6 rounded shadow mt-6">
        <div className="mb-4">
          <label className="inline-flex items-center mr-4">
            <input type="checkbox" name="food" checked={selected.food} onChange={handleChange} className="mr-2" /> Food (+$100 if not included)
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" name="accommodation" checked={selected.accommodation} onChange={handleChange} className="mr-2" /> Accommodation (+$200 if not included)
          </label>
        </div>
        <div className="mb-4 font-bold">Total Price: ${total}</div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button type="submit" className="btn-primary w-full">Book Now</button>
      </form>
    </div>
  );
};

export default PackageDetails; 