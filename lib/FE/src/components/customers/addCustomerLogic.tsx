import { createCustomer } from '../../api/customerApi';
import { Customer } from '../../model/src';
import { AddCustomerFormInputs } from './AddCustomerForm';

export const addCustomer = async (data: AddCustomerFormInputs): Promise<Customer.Model> => {
  const customerData: Customer.Model = {
    customer_id: '',
    first_name: data.first_name,
    last_name: data.last_name,
    id_number: data.id_number,
    email: data.email,
    phone_number: data.phone_number,
    additional_phone: data.additional_phone,
    city: data.city,
    address1: data.address,
    address2: '',
    zipCode: '2222',
    status: '',
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
  };
  
  return await createCustomer(customerData);
};
