import { LogOut, Calendar, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            📅 Admin Panel
          </h1>
          <div className="flex items-center gap-6">
            <span className="text-gray-600">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
        
        <div className="flex gap-4 mt-4">
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }
          >
            <Calendar size={18} />
            Appointments
          </NavLink>
          
          <NavLink
            to="/consultants"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }
          >
            <Users size={18} />
            Consultants
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;