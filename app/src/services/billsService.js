import axios from 'axios';

const API_URL = 'http://localhost:5000/bills';

export const getBills = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getBillById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createBill = async (billData) => {
  const response = await axios.post(API_URL, billData);
  return response.data;
};

export const updateBill = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteBill = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
