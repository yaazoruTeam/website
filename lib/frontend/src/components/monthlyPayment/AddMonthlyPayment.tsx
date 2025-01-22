import React from 'react';
import CustomerSelector from '../customers/CustomerSelector';
import PaymentForm from './PaymentForm';
import FormToAddItems from './FormToAddItems';

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
        <>
            <CustomerSelector onCustomerSelect={() => { }} />
            <FormToAddItems />
            <PaymentForm />
        </>
    );
};

export default AddMonthlyPayment;
