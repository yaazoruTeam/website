import { forwardRef, useImperativeHandle, useRef } from "react";
import AddCustomerForm from "../AddCustomerForm";
import { Customer } from "../../../model/src";
import { Box } from "@mui/system";

export interface CustomerDetailsRef {
    getCustomerData: () => Partial<Customer.Model>;
    submitForm: () => void;
}

const CustomerDetails = forwardRef<CustomerDetailsRef, { customer: Customer.Model }>(
    ({ customer }, ref) => {
        const formValuesRef = useRef<Partial<Customer.Model>>({});
        const formSubmitRef = useRef<() => void>(() => { });

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

        return (
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
        );
    });

export default CustomerDetails;
