import axios from 'axios';

const API_URL = 'https://retail-billing-dm1w.onrender.com';

export const login = async (data) => {
  return await axios.post(`${API_URL}/login`, data);
};
