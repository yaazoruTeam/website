import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';

export const setupAxiosInterceptors = (navigate: NavigateFunction) => {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.error('Unauthorized - Redirecting to login');
                localStorage.removeItem('token');
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );
};
