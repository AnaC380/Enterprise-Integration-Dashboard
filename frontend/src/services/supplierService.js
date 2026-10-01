import api from './api';

export const getSuppliers = async () => {
    const response = await api.get('/Supplier');
    return response.data;
};

export const getSupplierById = async (id) => {
    const response = await api.get(`/Supplier/${id}`);
    return response.data;
};