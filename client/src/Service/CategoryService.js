import axios from 'axios';

const API_URL = 'https://retail-billing-dm1w.onrender.com';
const token=localStorage.getItem('token')
console.log(token)
const AUTH_HEADER = {
  headers: {
    'Authorization': `Bearer ${token}`
    
  }
};

export const addCategory = async (category) => {
  return await axios.post(`${API_URL}/admin/categories`, category, AUTH_HEADER);
};

export const deleteCategory = async (categoryId) => {
  return await axios.delete(`${API_URL}/admin/categories/${categoryId}`, AUTH_HEADER);
};

export const fetchCategories = async () => {
  return await axios.get(`${API_URL}/categories`, AUTH_HEADER);
};
