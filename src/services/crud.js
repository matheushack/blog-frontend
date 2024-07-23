import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getApi = {
    async fetch(url, parameters) {
        return new Promise(async resolve => {
            const response = await axios.get(`${API_URL}/${url}`, {params: parameters});
            resolve(response.data);
        })
    }
}

export const listApi = {
    async fetch({page, itemsPerPage, sortBy}, url) {
        return new Promise(async resolve => {
            const response = await axios.get(`${API_URL}/${url}`, {
                params: {
                    page: page,
                    per_page: itemsPerPage,
                    sort: sortBy
                }
            });

            resolve({items: response.data.data, total: response.data.meta.total});
        })
    }
}

export const newApi = {
    async fetch(form, url) {
        return new Promise(async resolve => {
            const response = await axios.post(`${API_URL}/${url}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            resolve(response.data);
        })
    }
}

export const updateApi = {
    async fetch(form, url) {
        return new Promise(async resolve => {
            const response = await axios.put(`${API_URL}/${url}/${form.id}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            resolve(response.data);
        })
    },
}

export const deleteApi = {
    async fetch(item, url) {
        return new Promise(async resolve => {
            const response = await axios.delete(`${API_URL}/${url}/${item.id}`);
            resolve(response.data);
        })
    },
}
