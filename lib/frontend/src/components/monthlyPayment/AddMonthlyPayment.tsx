import React from 'react';
import CustomerSelector from '../customers/CustomerSelector';
import PaymentForm from './PaymentForm';
import FormToAddItems from './FormToAddItems';
import { CustomButton } from '../Button/Button';

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
            <CustomButton
                label="שמירה"
                sx={{
                    background: "#FF7F07",
                    color: "white",
                    "&:hover": {
                        background: "#0a425f",
                    },
                }}
                onClick={() => addMonthlyPayment}
            />
        </>
    );
};

export default AddMonthlyPayment;
