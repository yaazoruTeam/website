import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import AddCustomerForm from "../AddCustomerForm";
import { Customer, Device } from "../../../model/src";
import { Box } from "@mui/system";
import { getAllDevicesByCustomerId } from "../../../api/customerDevice";
import DeviceRow from "../../devices/deviceCard";
import CustomTypography from "../../designComponent/Typography";
import { colors } from "../../../styles/theme";
import { useTranslation } from "react-i18next";

export interface CustomerDetailsRef {
    getCustomerData: () => Partial<Customer.Model>;
    submitForm: () => void;
}

const CustomerDetails = forwardRef<CustomerDetailsRef, { customer: Customer.Model }>(
    ({ customer }, ref) => {
        const formValuesRef = useRef<Partial<Customer.Model>>({});
        const formSubmitRef = useRef<() => void>(() => { });
        const [devices, setDevices] = useState<Device.Model[]>([]);
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
            const getDevicesByCustomerId = async (customer_id: string) => {
                const devicesData: Device.Model[] = await getAllDevicesByCustomerId(customer_id);
                setDevices(devicesData);
            };
            getDevicesByCustomerId(customer.customer_id);
        }, [customer]);

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
                {devices.map((d) => (
                    <DeviceRow
                        key={d.device_id}
                        device={d}
                        isOpen={openedDeviceId === d.device_id}
                        onClick={() => handleRowClick(d.device_id)}
                        showForm={true}
                    />
                ))}
            </Box>
        );
    });

export default CustomerDetails;
