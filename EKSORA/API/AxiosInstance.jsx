import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://api-eksora-app.onrender.com';

const AxiosInstance = (contentType = 'application/json') => {
    const axiosInstance = axios.create({
        baseURL: baseUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': contentType
        }
    });

    axiosInstance.interceptors.response.use(
        res => res.data,
        err => {
            console.log('Lỗi API:', err.response?.data || err.message);
            return Promise.reject(err);
        }
    );

    return axiosInstance;
};

export default AxiosInstance;
