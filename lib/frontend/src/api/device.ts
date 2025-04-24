import axios, { AxiosResponse } from 'axios';
import { Device } from '../model';
import { handleTokenRefresh } from './token';


// const baseUrl = `${process.env.BASE_URL}/customer`;
const baseUrl = 'http://localhost:3006/controller/device';

// GET
export const getDeices = async (): Promise<Device.Model[]> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return [];
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<Device.Model[]> = await axios.get(baseUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching devices", error);
        throw error;
    }
};

//GET(id)
export const getDeviceById = async (device_id: string): Promise<Device.Model> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return {} as Device.Model;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<Device.Model> = await axios.get(`${baseUrl}/${device_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching device by id", error);
        throw error;
    }
};
