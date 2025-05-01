import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, authFetch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await authFetch('http://localhost:3000/api/users/profile');
        const data = await res.json();
        setProfile(data.user);
        setBookings(data.bookings || []);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>

      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Profile Info */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-2">{profile?.name}</h3>
            <p className="text-gray-600">{profile?.email}</p>
            <p className="text-gray-600">Address: {profile?.address || 'Not provided'}</p>
            {/* Add update form if needed */}
          </div>

          {/* Booking Filter */}
          <div className="mb-4 flex gap-4">
            {['all', 'upcoming', 'active', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Bookings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.length === 0 ? (
              <p>No bookings found for "{filter}".</p>
            ) : (
              filteredBookings.map(booking => (
                <div
                  key={booking._id}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <h4 className="font-bold">{booking.package?.name}</h4>
                  <p>From: {booking.package?.from}</p>
                  <p>To: {booking.package?.to}</p>
                  <p>
                    Date:{' '}
                    {new Date(booking.package?.startDate).toLocaleDateString()} -{' '}
                    {new Date(booking.package?.endDate).toLocaleDateString()}
                  </p>
                  <p>Status: {booking.status}</p>
                  <p>Total Price: ${booking.totalPrice}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
