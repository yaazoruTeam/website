import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getAllCustomerDevicesByCustomerId } from "../../../api/customerDevice";
import { Customer, CustomerDevice, Device } from "../../../model";
import CustomTypography from "../../designComponent/Typography";
import { useTranslation } from "react-i18next";
import { colors } from "../../../styles/theme";
import DeviceRow from "../../devices/deviceCard";
import { useNavigate } from "react-router-dom";
import { getDeviceById } from "../../../api/device";

const DeviceDetails: React.FC<{ customer: Customer.Model }> = ({ customer }) => {
    const { t } = useTranslation();
    const [devices, setDevices] = useState<(Device.Model & { customerDevice: CustomerDevice.Model })[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getDevicesByCustomerId = async () => {
            const customerDevices: CustomerDevice.Model[] = await getAllCustomerDevicesByCustomerId(customer.customer_id);
            
            const devicesData = await Promise.all(
                customerDevices.map(async (customerDevice) => {
                    const device = await getDeviceById(customerDevice.device_id);
                    return { ...device, customerDevice };
                })
            );

            setDevices(devicesData);
        };

        getDevicesByCustomerId();
    }, [customer.customer_id]);

    const handleRowClick = (deviceId: string) => {
        navigate('./device');
    };

    return (
        <Box>
            <Box sx={{ paddingBottom: '28px' }}>
                <CustomTypography
                    text={t('devices')}
                    variant="h1"
                    weight="bold"
                    color={colors.brand.color_9}
                />
            </Box>
            {devices.map((device) => (
                <DeviceRow
                    key={device.device_id}
                    device={device}  
                    customerDevice={device.customerDevice} 
                    onClick={() => handleRowClick(device.device_id)}
                    showForm={false}
                />
            ))}
        </Box>
    );
};

export default DeviceDetails;
