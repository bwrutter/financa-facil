import axios from 'axios';
import { auth } from '../firebase/config';

const API_URL = process.env.VITE_APP_API_URL || 'http://localhost:5000/api/category';

const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const getCategories = async () => {
  const headers = await getAuthHeader();
  const response = await axios.get(API_URL, { headers });
  return response.data;
};

export const createCategory = async (categoryData) => {
  const headers = await getAuthHeader();
  const response = await axios.post(API_URL, categoryData, { headers });
  return response.data;
};

export const deleteCategory = async (id) => {
  const headers = await getAuthHeader();
  const response = await axios.delete(`${API_URL}/${id}`, { headers });
  return response.data;
};
