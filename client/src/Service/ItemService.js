import axios from 'axios';

const API_URL = 'http://localhost:8080';
const AUTH_HEADER = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
};

export const addItem = async (item) => {
  return await axios.post(`${API_URL}/admin/items`, item, AUTH_HEADER);
};

export const deleteItems = async (itemId) => {
  return await axios.delete(`${API_URL}/admin/items/${itemId}`, AUTH_HEADER);
};

export const fetchItems = async () => {
  return await axios.get(`${API_URL}/items`, AUTH_HEADER);
};

export const updateItemStock = async (itemId, addedQuantity) => {
  return await axios.put(`${API_URL}/admin/items/${itemId}/stock?addedQuantity=${addedQuantity}`, {}, AUTH_HEADER);
};


export const updateItemThreshold = async (itemId, minThreshold) => {
  return await axios.put(
    `${API_URL}/admin/items/${itemId}/threshold?minThreshold=${minThreshold}`,
    {},
    AUTH_HEADER 
  );
};

