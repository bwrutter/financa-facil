import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const createBill = async (billData) => {
    try {
        const response = await axios.post(API_URL, billData);
        return response.data;
    } catch (error) {
        console.error('Error creating bill:', error);
        throw error;
    }
};

const getBills = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching bills:', error);
        throw error;
    }
};

const getBillById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bill by ID:', error);
        throw error;
    }
};

const updateBill = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating bill:', error);
        throw error;
    }
};

const deleteBill = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting bill:', error);
        throw error;
    }
};

export { createBill, getBills, getBillById, updateBill, deleteBill };
