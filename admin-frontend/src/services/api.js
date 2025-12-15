// API Configuration - Update this URL if your backend runs on different port
const API_BASE = 'http://localhost:4000/api';
// const baseUrl = "http://127.0.0.1:4000/api";

export const api = {
  // Auth
  login: async (data) => {
    console.log('📡 API Call - Login');
    console.log('URL:', `${API_BASE}/auth/login`);
    console.log('Data:', { email: data.email, password: '***' });
    
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Consultants
  getConsultants: () => 
    fetch(`${API_BASE}/consultants`),

  createConsultant: (data, token) => 
    fetch(`${API_BASE}/consultants`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    }),

  // Appointments
  getAppointments: (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/appointments${query ? '?' + query : ''}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  updateStatus: (id, status, token) => 
    fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    }),

  // OTP Verification
  verifyOtp: (appointmentId, otp, token) =>
    fetch(`${API_BASE}/appointments/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ appointmentId, otp })
    }),

  resendOtp: (appointmentId, token) =>
    fetch(`${API_BASE}/appointments/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ appointmentId })
    })
};