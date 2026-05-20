const BASE_URL = 'http://25.6.215.63:8000/api';

function getToken() {
  return localStorage.getItem('ft_token');
}

async function request(method, path, body = null) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, options);
  } catch (networkErr) {
    const err = new Error('Unable to reach the server. Please check your connection.');
    err.status = 0;
    err.errors = {};
    throw err;
  }

  let data = {};
  try {
    data = await res.json();
  } catch (_) {
    if (!res.ok) {
      const err = new Error('An unexpected server error occurred.');
      err.status = res.status;
      err.errors = {};
      throw err;
    }
  }

  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong.');
    err.status = res.status;
    err.errors = data.errors || {};
    throw err;
  }

  return data;
}

export const api = {
  login: (email, password) => request('POST', '/login', { email, password }),
  register: (name, email, password, password_confirmation) =>
    request('POST', '/register', { name, email, password, password_confirmation }),
  logout: () => request('POST', '/logout'),
  me: () => request('GET', '/me'),

  // Profile
  getProfile: () => request('GET', '/profile'),
  updateProfile: (name, email, password, password_confirmation) => request('PUT', '/profile', {name, email, password, password_confirmation}),

  // Admin - Users
  getUsers: () => request('GET', '/admin/users'),
  updateUser: (id, data) => request('PUT', `/admin/users/${id}`, data),
  deleteUser: (id) => request('DELETE', `/admin/users/${id}`),
  activateUser: (id) => request('POST', `/admin/users/${id}/activate`),
  deactivateUser: (id) => request('POST', `/admin/users/${id}/deactivate`),

  // Admin - Memberships
  assignMembership: (userId, data) => request('POST', `/admin/memberships/${userId}`, data),
  updateMembership: (userId, data) => request('PUT', `/admin/memberships/${userId}`, data),
};