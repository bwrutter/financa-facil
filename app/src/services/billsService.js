import axios from 'axios';
import { auth } from '../firebase/config'

const API_URL = process.env.VITE_APP_API_URL || 'http://localhost:5000/api/bills';

const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const getBills = async () => {
  const headers = await getAuthHeader();
  const response = await axios.get(API_URL, { headers });
  return response.data;
};

export const getBillById = async (id) => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_URL}/${id}`, { headers });
  return response.data;
};

export const createBill = async (billData) => {
  const headers = await getAuthHeader();
  const response = await axios.post(API_URL, billData, { headers });
  return response.data;
};

export const updateBill = async (id, updatedData) => {
  const headers = await getAuthHeader();
  const response = await axios.put(`${API_URL}/${id}`, updatedData, { headers });
  return response.data;
};

export const deleteBill = async (id) => {
  const headers = await getAuthHeader();
  const response = await axios.delete(`${API_URL}/${id}`, { headers });
  return response.data;
};
