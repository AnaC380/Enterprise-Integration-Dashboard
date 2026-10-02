import api from './api';

export const getSuppliers = async () => {
    const response = await api.get('/api/Supplier');
    return response.data;
};

export const getSupplierById = async (id) => {
    const response = await api.get(`/api/Supplier/${id}`);
    return response.data;
};