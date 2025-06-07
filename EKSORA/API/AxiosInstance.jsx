import axios from 'axios';

const AxiosInstance = (contentType = 'application/json') => {
    const axiosInstance = axios.create({
        baseURL: 'https://api-eksora-app.onrender.com',
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