import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getAllDevicesByCustomerId } from "../../../api/customerDevice";
import { Customer, Device } from "../../../model";
import CustomTypography from "../../designComponent/Typography";
import { useTranslation } from "react-i18next";
import { colors } from "../../../styles/theme";
import DeviceRow from "../../devices/deviceCard";
import { useNavigate } from "react-router-dom";

const DeviceDetails: React.FC<{ customer: Customer.Model }> = ({ customer }) => {
    const { t } = useTranslation();
    const [devices, setDevices] = useState<Device.Model[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getDevicesByCustomerId = async (customer_id: string) => {
            const devicesData: Device.Model[] = await getAllDevicesByCustomerId(customer_id);
            setDevices(devicesData);
        };
        getDevicesByCustomerId(customer.customer_id);
    }, [customer]);

    const handleRowClick = (deviceId: string) => {
        navigate('./device')
    };

    return (
        <Box>
            <Box sx={{
                paddingBottom: '28px'
            }}>
                <CustomTypography
                    text={t('devices')}
                    variant="h1"
                    weight="bold"
                    color={colors.brand.color_9}
                />
            </Box>
            {devices.map((d) => (
                <DeviceRow
                    key={d.device_id}
                    device={d}
                    onClick={() => handleRowClick(d.device_id)}
                    showForm={false}
                />

            ))}
        </Box>
    );
};

export default DeviceDetails;
