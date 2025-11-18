// src/service/SmsService.js
import axios from "axios";

const API_URL = "http://localhost:8080";

const AUTH_HEADER = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

export const sendInvoiceSMS = async (phone, message) => {
  return await axios.post(
    `${API_URL}/admin/sms/send`,
    { phone, message },
    AUTH_HEADER
  );
};
