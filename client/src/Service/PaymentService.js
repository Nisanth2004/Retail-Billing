import axios from "axios";

const API_URL = 'https://retail-billing-dm1w.onrender.com';
const AUTH_HEADER = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
};

export const createRazorpayOrder = async (data) => {
  return await axios.post(`${API_URL}/payments/create-order`, data, AUTH_HEADER);
};

export const verifyPayment = async (paymentData) => {
  return await axios.post(`${API_URL}/payments/verify`, paymentData, AUTH_HEADER);
};
