import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const login = async (data) => {
  return await axios.post(`${API_URL}/login`, data);
};
