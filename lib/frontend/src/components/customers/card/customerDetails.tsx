import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import AddCustomerForm from "../AddCustomerForm";
import { Customer, Device,CustomerDevice } from "../../../model/src";
import { Box } from "@mui/system";
import DeviceRow from "../../devices/deviceCard";
import CustomTypography from "../../designComponent/Typography";
import { colors } from "../../../styles/theme";
import { useTranslation } from "react-i18next";
import { getAllCustomerDevicesByCustomerId } from "../../../api/customerDevice";
import { getDeviceById } from "../../../api/device";

export interface CustomerDetailsRef {
    getCustomerData: () => Partial<Customer.Model>;
    submitForm: () => void;
}

const CustomerDetails = forwardRef<CustomerDetailsRef, { customer: Customer.Model }>(
    ({ customer }, ref) => {
        const formValuesRef = useRef<Partial<Customer.Model>>({});
        const formSubmitRef = useRef<() => void>(() => { });
        const [devices, setDevices] = useState<(Device.Model & { customerDevice?: CustomerDevice.Model })[]>([]);
        const [openedDeviceId, setOpenedDeviceId] = useState<string | null>(null);
        const { t } = useTranslation();

        useImperativeHandle(ref, () => ({
            getCustomerData: () => {
                return formValuesRef.current;
            },
            submitForm: () => {
                if (formSubmitRef.current) {
                    formSubmitRef.current();
                }
            }
        }));

            useEffect(() => {
                const getDevicesByCustomerId = async () => {
                    // שולף את כל ה- customerDevices של הלקוח
                    const customerDevices: CustomerDevice.Model[] = await getAllCustomerDevicesByCustomerId(customer.customer_id);
                    
                    // שולף את המכשירים וממזג אותם עם המידע של ה- customerDevice
                    const devicesData = await Promise.all(
                        customerDevices.map(async (customerDevice) => {
                            const device = await getDeviceById(customerDevice.device_id);
                            return { ...device, customerDevice }; // מחבר את המידע של המכשיר עם ה- customerDevice
                        })
                    );
        
                    setDevices(devicesData);
                };
        
                getDevicesByCustomerId();
            }, [customer.customer_id]);

        const handleRowClick = (deviceId: string) => {
            setOpenedDeviceId((prev) => (prev === deviceId ? null : deviceId));
        };


        return (
            <Box>
                <Box sx={{ marginBottom: '80px' }}>
                    <AddCustomerForm
                        onSubmit={(data) => {
                            formValuesRef.current = data;
                        }}
                        setSubmitHandler={(submitFn) => {
                            formSubmitRef.current = submitFn;
                        }}
                        initialValues={{
                            first_name: customer.first_name,
                            last_name: customer.last_name,
                            id_number: customer.id_number,
                            phone_number: customer.phone_number,
                            additional_phone: customer.additional_phone,
                            email: customer.email,
                            address: customer.address1,
                            city: customer.city,
                        }} />
                </Box>
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
                {devices.map((device) => (
                    <DeviceRow
                        key={device.device_id}
                        device={device}
                        customerDevice={device.customerDevice!}
                        isOpen={openedDeviceId === device.device_id}
                        onClick={() => handleRowClick(device.device_id)}
                        showForm={true}
                    />
                ))}
            </Box>
        );
    });

export default CustomerDetails;
