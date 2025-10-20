import axios from 'axios';
import { auth } from '../firebase/config'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${baseUrl}/api/bills`;

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

export const billsService = {
  // Buscar todas as contas
  getAll: async () => {
    const headers = await getAuthHeader();
    const response = await axios.get(API_URL, { headers });
    return response.data;
  },

  // Buscar contas recorrentes próximas do vencimento
  getUpcoming: async (days = 7) => {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_URL}/upcoming?days=${days}`, { headers });
    return response.data;
  },

  // Criar nova conta
  create: async (billData) => {
    const headers = await getAuthHeader();
    const response = await axios.post(API_URL, billData, { headers });
    return response.data;
  },

  // Atualizar conta
  update: async (id, billData) => {
    const headers = await getAuthHeader();
    const response = await axios.put(`${API_URL}/${id}`, billData, { headers });
    return response.data;
  },

  // Deletar conta
  delete: async (id) => {
    const headers = await getAuthHeader();
    const response = await axios.delete(`${API_URL}/${id}`, { headers });
    return response.data;
  },

  // Processar pagamento recorrente
  processPayment: async (id) => {
    const headers = await getAuthHeader();
    const response = await axios.post(`${API_URL}/${id}/process-payment`, {}, { headers });
    return response.data;
  }
};
