import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/packages" className="bg-white rounded shadow p-6 flex flex-col items-center hover:bg-blue-50 transition">
          <span className="text-xl font-semibold mb-2">Package Management</span>
          <span className="text-gray-500">Add, edit, or delete travel packages</span>
        </Link>
        <Link to="/admin/bookings" className="bg-white rounded shadow p-6 flex flex-col items-center hover:bg-blue-50 transition">
          <span className="text-xl font-semibold mb-2">Booking Management</span>
          <span className="text-gray-500">View and manage all bookings</span>
        </Link>
        <Link to="/admin/users" className="bg-white rounded shadow p-6 flex flex-col items-center hover:bg-blue-50 transition">
          <span className="text-xl font-semibold mb-2">User Management</span>
          <span className="text-gray-500">View users and their bookings</span>
        </Link>
        <Link to="/admin/analytics" className="bg-white rounded shadow p-6 flex flex-col items-center hover:bg-blue-50 transition">
          <span className="text-xl font-semibold mb-2">Analytics</span>
          <span className="text-gray-500">View booking and package analytics</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard; 