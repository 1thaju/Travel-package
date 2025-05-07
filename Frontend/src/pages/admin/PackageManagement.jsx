import React, { useEffect, useState } from 'react';
import API from '../../api/adminApi';

const initialForm = {
  from: '',
  to: '',
  startDate: '',
  endDate: '',
  basePrice: '',
  includedServices: { food: false, accommodation: false }
};

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState([]);
  const [usersWithBookings, setUsersWithBookings] = useState([]);

  // Fetch all packages
  const fetchPackages = async () => {
    setLoading(true);
    const res = await API.get('/travel-packages');
    setPackages(res.data.data || res.data);
    setLoading(false);
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    const res = await API.get('/travel-packages/admin/status-booking-count');
    setAnalytics(res.data);
  };

  // Fetch users with bookings
  const fetchUsersWithBookings = async () => {
    const res = await API.get('/users/admin/with-bookings');
    setUsersWithBookings(res.data);
  };

  useEffect(() => {
    fetchPackages();
    fetchAnalytics();
    fetchUsersWithBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'food' || name === 'accommodation') {
      setForm({ ...form, includedServices: { ...form.includedServices, [name]: checked } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await API.put(`/travel-packages/${editingId}`, form);
        setSuccess('Package updated!');
      } else {
        await API.post('/travel-packages', form);
        setSuccess('Package added!');
      }
      setForm(initialForm);
      setEditingId(null);
      fetchPackages();
      fetchAnalytics();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (pkg) => {
    setForm({
      from: pkg.from,
      to: pkg.to,
      startDate: pkg.startDate.slice(0, 10),
      endDate: pkg.endDate.slice(0, 10),
      basePrice: pkg.basePrice,
      includedServices: pkg.includedServices || { food: false, accommodation: false }
    });
    setEditingId(pkg._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/travel-packages/${id}`);
      setSuccess('Package deleted!');
      fetchPackages();
      fetchAnalytics();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Admin: Package Management</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 max-w-xl">
        <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Package' : 'Add Package'}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="flex gap-4 mb-2">
          <input name="from" value={form.from} onChange={handleChange} placeholder="From" className="p-2 border rounded w-full" required />
          <input name="to" value={form.to} onChange={handleChange} placeholder="To" className="p-2 border rounded w-full" required />
        </div>
        <div className="flex gap-4 mb-2">
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="p-2 border rounded w-full" required />
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="p-2 border rounded w-full" required />
        </div>
        <input name="basePrice" type="number" value={form.basePrice} onChange={handleChange} placeholder="Base Price" className="p-2 border rounded w-full mb-2" required />
        <div className="flex gap-4 mb-4">
          <label className="inline-flex items-center">
            <input type="checkbox" name="food" checked={form.includedServices.food} onChange={handleChange} className="mr-2" /> Food
          </label>
          <label className="inline-flex items-center">
            <input type="checkbox" name="accommodation" checked={form.includedServices.accommodation} onChange={handleChange} className="mr-2" /> Accommodation
          </label>
        </div>
        <button type="submit" className="btn-primary w-full">{editingId ? 'Update' : 'Add'} Package</button>
        {editingId && <button type="button" onClick={() => { setForm(initialForm); setEditingId(null); }} className="w-full mt-2 text-blue-600 underline">Cancel Edit</button>}
      </form>
      <h2 className="text-lg font-semibold mb-2">All Packages</h2>
      {loading ? <div>Loading...</div> : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Start</th>
              <th className="p-2 border">End</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Food</th>
              <th className="p-2 border">Accommodation</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg._id}>
                <td className="p-2 border">{pkg.from}</td>
                <td className="p-2 border">{pkg.to}</td>
                <td className="p-2 border">{new Date(pkg.startDate).toLocaleDateString()}</td>
                <td className="p-2 border">{new Date(pkg.endDate).toLocaleDateString()}</td>
                <td className="p-2 border">${pkg.basePrice}</td>
                <td className="p-2 border text-center">{pkg.includedServices.food ? '✔️' : ''}</td>
                <td className="p-2 border text-center">{pkg.includedServices.accommodation ? '✔️' : ''}</td>
                <td className="p-2 border">
                  <button onClick={() => handleEdit(pkg)} className="text-blue-600 mr-2 underline">Edit</button>
                  <button onClick={() => handleDelete(pkg._id)} className="text-red-600 underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Analytics Section */}
      <h2 className="text-lg font-semibold mt-8 mb-2">Package Analytics</h2>
      <table className="w-full bg-white rounded shadow mb-8">
        <thead>
          <tr>
            <th className="p-2 border">From</th>
            <th className="p-2 border">To</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Booking Count</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map(pkg => (
            <tr key={pkg._id}>
              <td className="p-2 border">{pkg.from}</td>
              <td className="p-2 border">{pkg.to}</td>
              <td className="p-2 border">{pkg.status}</td>
              <td className="p-2 border">{pkg.bookingCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Users with Bookings Section */}
      <h2 className="text-lg font-semibold mt-8 mb-2">All Users & Bookings</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Bookings</th>
          </tr>
        </thead>
        <tbody>
          {usersWithBookings.map(user => (
            <tr key={user._id}>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">
                {user.bookings.map(b => (
                  <div key={b._id}>
                    {b.package ? `${b.package.from} → ${b.package.to}` : 'N/A'}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PackageManagement; 