import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getAllDevicesByCustomerId } from "../../../api/customerDevice";
import { Customer, Device } from "../../../model";

const DeviceDetails: React.FC<{ customer: Customer.Model }> = ({ customer }) => {

    const [devices, setDevices] = useState<Device.Model[]>([])

    useEffect(() => {
        const getDevicesByCustomerId = async (customer_id: string) => {
            const devicesData: Device.Model[] = await getAllDevicesByCustomerId(customer_id);
            setDevices(devicesData);
        };
        getDevicesByCustomerId(customer.customer_id);
    }, [customer]);

    return (
        <Box>
            {devices.map((d) => (<Box>{d.IMEI_1}</Box>))}
        </Box>
    );
};

export default DeviceDetails;
