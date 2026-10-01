import api from './api';

export const getContracts = async () => {
    const response = await api.get('/Contract');
    return response.data;
};

export const getContractsBySupplier = async (supplierId) => {
    const response = await api.get(`/Contract/supplier/${supplierId}`);
    return response.data;
};