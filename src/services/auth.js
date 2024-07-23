import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {email, password});
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        localStorage.setItem('token', response.data.token);
        return true;
    } catch (error) {
        if (typeof error.response !== 'undefined' && error.response.data.errors) {
            throw new Error(error.response.data.message);
        }

        throw error;
    }
};

export const authToken = () => {
    return localStorage.getItem('token');
};

export const userInfo = async () => {
    try {
        const response = await axios.get(`${API_URL}/info`);
        if (!response.data.data) {
            localStorage.clear();
            throw new Error(response.data.message);
        }

        return response.data.data;
    } catch (error) {
        return false;
    }
};

export const logout = async () => {
    try {
        const response = await axios.get(`${API_URL}/logout`);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        localStorage.clear();
        return true;
    } catch (error) {
        throw error;
    }
};
