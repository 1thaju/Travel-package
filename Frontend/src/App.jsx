import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Packages from './pages/Packages';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './components/AdminLogin';
import PackageManagement from './pages/admin/PackageManagement';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css'
import AdminDashboard from './components/AdminDashboard';
import PackageDetails from './pages/PackageDetails';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          
          {/* Admin Package Management */}
          <Route
            path="/admin/packages"
            element={
              <AdminRoute>
                <PackageManagement />
              </AdminRoute>
            }
          />

          {/* Admin Booking Management */}
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <div>Booking Management</div>
              </AdminRoute>
            }
          />

          {/* Admin User Management */}
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <div>User Management</div>
              </AdminRoute>
            }
          />
          
          {/* Redirect root to appropriate page */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          
          {/* Catch all route - redirect to admin login */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
