import React from 'react';
import { Box, Typography } from '@mui/material';
import AddCustomerForm, { AddCustomerFormInputs } from '../../stories/Form/AddCustomerForm';
import { createCustomer } from '../../api/customerApi';
import { Customer } from '../../model/src';
import MonthlyPaymentForm from '../../stories/Form/SelectCustomerForm';
import CustomerSelector from '../customers/CustomerSelector';

interface Props {
    onBack: () => void;
}

export interface AddMonthlyPaymentFormInputs {
    full_name: string;
}

const AddMonthlyPayment: React.FC<Props> = ({ onBack }) => {

    const addMonthlyPayment = async (data: AddMonthlyPaymentFormInputs) => {
        console.log('add monthly payment');


    };

    return (
        // <h1>הוספת הוראת קבע</h1>
        // <MonthlyAmountForm  />
        <CustomerSelector onCustomerSelect={() => { }} />
    );
};

export default AddMonthlyPayment;
