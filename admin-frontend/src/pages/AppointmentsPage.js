import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from '../components/Toast';
import { Filter, Loader, RefreshCw } from 'lucide-react';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({ date: '', status: '', consultantId: '' });
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { token } = useAuth();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.date) params.date = filters.date;
      if (filters.status) params.status = filters.status;
      if (filters.consultantId) params.consultantId = filters.consultantId;
      
      const res = await api.getAppointments(token, params);
      const data = await res.json();
      
      if (res.ok) {
        setAppointments(data);
      } else {
        setToast({ message: 'Failed to load appointments', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Connection error. Check if backend is running.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultants = async () => {
    try {
      const res = await api.getConsultants();
      const data = await res.json();
      if (res.ok) {
        setConsultants(data);
      }
    } catch (error) {
      console.error('Failed to load consultants');
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filters, token]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.updateStatus(id, status, token);
      
      if (res.ok) {
        setToast({ message: 'Status updated successfully ✓', type: 'success' });
        fetchAppointments();
      } else {
        const data = await res.json();
        setToast({ message: data.message || 'Failed to update status', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Connection failed', type: 'error' });
    }
  };

  const handleVerifyOtp = async (appointmentId) => {
    const otp = prompt('Enter OTP to verify appointment:');
    if (!otp) return;

    try {
      const res = await api.verifyOtp(appointmentId, otp, token);
      const data = await res.json();
      
      if (res.ok) {
        setToast({ message: 'OTP verified successfully ✓', type: 'success' });
        fetchAppointments();
      } else {
        setToast({ message: data.message || 'Invalid OTP', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Connection failed', type: 'error' });
    }
  };

  const handleResendOtp = async (appointmentId) => {
    try {
      const res = await api.resendOtp(appointmentId, token);
      const data = await res.json();
      
      if (res.ok) {
        setToast({ message: 'OTP resent successfully ✓', type: 'success' });
      } else {
        setToast({ message: data.message || 'Failed to resend OTP', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Connection failed', type: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const clearFilters = () => {
    setFilters({ date: '', status: '', consultantId: '' });
  };

  const hasActiveFilters = filters.date || filters.status || filters.consultantId;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Appointments Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and track all appointment bookings
          </p>
        </div>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter size={20} className="text-blue-600" />
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultant
            </label>
            <select
              value={filters.consultantId}
              onChange={(e) => setFilters({ ...filters, consultantId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">All Consultants</option>
              {consultants.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            All Appointments ({appointments.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <Loader size={32} className="animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-600">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No appointments found</p>
            <p className="text-sm mt-1">
              {hasActiveFilters ? 'Try adjusting your filters' : 'No appointments have been booked yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consultant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {apt.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {apt.consultant?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {apt.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {apt.startTime} - {apt.endTime}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                      {apt.isVerified === false && (
                        <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusUpdate(apt._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        {apt.isVerified === false && (
                          <button
                            onClick={() => handleVerifyOtp(apt._id)}
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                            title="Verify OTP"
                          >
                            Verify OTP
                          </button>
                        )}
                        {apt.isVerified === false && (
                          <button
                            onClick={() => handleResendOtp(apt._id)}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                            title="Resend OTP"
                          >
                            Resend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;