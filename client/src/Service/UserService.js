import axios from 'axios';

const API_URL = 'https://retail-billing-dm1w.onrender.com';
const AUTH_HEADER = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
};

export const addUser = async (user) => {
  return await axios.post(`${API_URL}/admin/register`, user, AUTH_HEADER);
};

export const deleteUser = async (id) => {
  return await axios.delete(`${API_URL}/admin/users/${id}`, AUTH_HEADER);
};

export const fetchUsers = async () => {
  return await axios.get(`${API_URL}/admin/users`, AUTH_HEADER);
};
