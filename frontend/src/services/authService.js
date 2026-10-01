import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/api/Auth/login', { email, password });
    return response.data;
};

// role is never sent by the client — the server always assigns "Viewer"
export const register = async (name, email, password) => {
    const response = await api.post('/api/Auth/register', { name, email, password });
    return response.data;
};
