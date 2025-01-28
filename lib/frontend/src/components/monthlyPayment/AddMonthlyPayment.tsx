import React, { useEffect, useRef, useState } from 'react';
import CustomerSelector from '../customers/CustomerSelector';
import PaymentForm from './PaymentForm';
import FormToAddItems from './FormToAddItems';
import { CustomButton } from '../Button/Button';
import { ItemFormInputs } from '../../stories/Form/AddItemForm';

interface Props {
    onBack: () => void;
}

export interface AddMonthlyPaymentFormInputs {
    full_name: string;
}

const AddMonthlyPayment: React.FC<Props> = ({ onBack }) => {
    const [customerData, setCustomerData] = useState<any>(null); // נתוני לקוח
    const [itemsData, setItemsData] = useState<ItemFormInputs[]>([]); // נתוני פריטים
    const [paymentData, setPaymentData] = useState<any>(null); // נתוני תשלום
    const [timeData, setTimeData] = useState<any>(null); // נתוני זמן ההוראת קבע

    const paymentFormRef = useRef<{ chargeCcData: () => void } | null>(null);


    useEffect(() => {
        if (paymentData) {
            console.log("הנתונים עודכנו:", paymentData);
        }
        // בדיקה אם כל הנתונים קיימים
        if (!customerData || !itemsData.length || !paymentData || !timeData) {
            console.error("לא כל הנתונים מוכנים!");
            return; // אם יש נתון חסר, לא נבצע את קריאות השרת
        }else{
            console.log('ניתן לבצע את הקריאות לשרת----------בהצלחה!!!');
            
        }
    }, [paymentData]); // זה יתעדכן כשתהיה עדכון ב-paymentData

    useEffect(() => {
        console.log('נתוני הזמן המעודכנים:', timeData);
    }, [timeData]);

    const addMonthlyPayment = async () => {
        console.log('Adding monthly payment:', {
            customerData,
            itemsData,
            paymentData,
            timeData,
        });
        try {
            const responsePyment: any = await paymentFormRef.current?.chargeCcData(); // תחכה עד שהפעולה תושלם
            console.log('Payment completed');
            console.log(responsePyment);
            console.log('pymentData:', paymentData);
        } catch (error) {
            console.error('Error during payment:', error);
        }
    };

    return (
        <>
            <CustomerSelector onCustomerSelect={setCustomerData} />
            <FormToAddItems onItemsChange={setItemsData} />
            <PaymentForm ref={paymentFormRef} onPaymentChange={setPaymentData} OnTimeChange={setTimeData} />
            <CustomButton
                label="שמירה"
                sx={{
                    background: "#FF7F07",
                    color: "white",
                    "&:hover": {
                        background: "#0a425f",
                    },
                }}
                onClick={addMonthlyPayment}
            />
        </>
    );
};

export default AddMonthlyPayment;
