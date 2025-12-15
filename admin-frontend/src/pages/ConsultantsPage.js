import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Toast from '../components/Toast';
import { UserPlus, Loader } from 'lucide-react';

const ConsultantsPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { token } = useAuth();

  const fetchConsultants = async () => {
    setFetchLoading(true);
    try {
      const res = await api.getConsultants();
      const data = await res.json();
      if (res.ok) {
        setConsultants(data);
      } else {
        setToast({ message: 'Failed to load consultants', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Connection error. Check if backend is running.', type: 'error' });
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !specialization.trim()) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    setLoading(true);
    
    try {
      const res = await api.createConsultant({ name, specialization }, token);
      const data = await res.json();
      
      if (res.ok) {
        setToast({ message: 'Consultant added successfully ✓', type: 'success' });
        setName('');
        setSpecialization('');
        fetchConsultants();
      } else {
        setToast({ message: data.message || 'Failed to add consultant', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Connection failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Consultants Management
        </h2>
        <p className="text-gray-600 mt-1">
          Add and manage consultants for appointment bookings
        </p>
      </div>
      
      {/* Add Consultant Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus size={20} className="text-blue-600" />
          Add New Consultant
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Consultant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <input
            type="text"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-medium shadow-md"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Add Consultant
              </>
            )}
          </button>
        </div>
      </div>

      {/* Consultants List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            All Consultants ({consultants.length})
          </h3>
        </div>
        
        {fetchLoading ? (
          <div className="p-8 text-center">
            <Loader size={32} className="animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-600">Loading consultants...</p>
          </div>
        ) : consultants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No consultants found</p>
            <p className="text-sm mt-1">Add your first consultant using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {consultants.map((c, index) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">
                            {c.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {c.specialization}
                      </span>
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

export default ConsultantsPage;