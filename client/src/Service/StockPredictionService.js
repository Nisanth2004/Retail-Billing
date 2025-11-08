import axios from "axios";

const API_URL = "http://localhost:8080";
const AUTH_HEADER = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

export const getStockPredictions = async () => {
  return await axios.get(`${API_URL}/predictions`, AUTH_HEADER);
};
