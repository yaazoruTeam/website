import axios, { AxiosResponse } from 'axios';
import { handleTokenRefresh } from './token';
import { CustomerDevice, Device } from '../model';
import { getDeviceById } from './device';

// const baseUrl = `${process.env.BASE_URL}/customer`;
const baseUrl = 'http://localhost:3006/controller/customerDevice';

// GET
export const getAllDevicesByCustomerId = async (customer_id: string): Promise<Device.Model[]> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return [];
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<CustomerDevice.Model[]> = await axios.get(`${baseUrl}/allDevices/${customer_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const customerDevices: CustomerDevice.Model[] = response.data;
        let devices: Device.Model[] = [];
        for (const customerDevice of customerDevices) {
            devices.push(await getDeviceById(customerDevice.device_id));
        }
        return devices;
    } catch (error) {
        console.error("Error fetching device by customer id", error);
        throw error;
    }
};
