import React, { useEffect, useRef, useState } from 'react';
import CustomerSelector from '../customers/CustomerSelector';
import PaymentForm from './PaymentForm';
import FormToAddItems from './FormToAddItems';
import { CustomButton } from '../designComponent/Button';
import { CreditDetails, ItemForMonthlyPayment, TransactionDetails } from '../../model/src';
import { createTransactionDetails } from '../../api/TransactionDetails';
import { createCreditDetails } from '../../api/creditDetails';
import { useMediaQuery } from '@mui/material';

interface Props {
    onBack: () => void;
}

export interface AddMonthlyPaymentFormInputs {
    full_name: string;
}

const AddMonthlyPayment: React.FC<Props> = ({ onBack }) => {
    const [customerData, setCustomerData] = useState<any>(null); // נתוני לקוח
    const [itemsData, setItemsData] = useState<ItemForMonthlyPayment.Model[]>([]); // נתוני פריטים
    const [paymentData, setPaymentData] = useState<any>(null); // נתוני תשלום
    const [timeData, setTimeData] = useState<any>(null); // נתוני זמן ההוראת קבע
    const paymentFormRef = useRef<{ chargeCcData: () => void } | null>(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        if (paymentData) {
            console.log("הנתונים עודכנו:", paymentData);
        }
        // בדיקה אם כל הנתונים קיימים
        if (!customerData || !itemsData.length || !paymentData || !timeData) {
            console.error("לא כל הנתונים מוכנים!");
            return; // אם יש נתון חסר, לא נבצע את קריאות השרת
        } else {
            console.log('ניתן לבצע את הקריאות לשרת----------בהצלחה!!!');
            addMonthlyPayment();
        }
    }, [paymentData]); // זה יתעדכן כשתהיה עדכון ב-paymentData

    useEffect(() => {
        console.log('נתוני הזמן המעודכנים:', timeData);
    }, [timeData]);


    // פונקציה לחישוב התאריך האחרון
    const calculateEndDate = (startDate: Date, numberOfCharges: number, chargeIntervalMonths: number) => {
        // התאריך הסופי התחלתי הוא תאריך ההתחלה
        let endDate = new Date(startDate);

        // מוסיפים את החודשים הנדרשים לכל חיוב
        endDate.setMonth(endDate.getMonth() + chargeIntervalMonths * (numberOfCharges - 1));

        // מחזירים את התאריך האחרון בפורמט dd/mm/yy
        const formattedEndDate = `${String(endDate.getDate()).padStart(2, '0')}/${String(endDate.getMonth() + 1).padStart(2, '0')}/${endDate.getFullYear().toString().slice(2)}`;

        return formattedEndDate;
    };

    // פונקציה להחזרת התוצאה הסופית
    const getTheRangeOfMonths = () => {
        const formattedStartDate = `${String(timeData.startDate.getDate()).padStart(2, '0')}/${String(timeData.startDate.getMonth() + 1).padStart(2, '0')}/${timeData.startDate.getFullYear().toString().slice(2)}`;

        const endDate = calculateEndDate(timeData.startDate, timeData.payments, timeData.mustEvery);

        return `${formattedStartDate}-${endDate}`;
    };

    const getAmount = () => {
        let sum: number = 0;
        itemsData.forEach((item) => {
            sum += parseFloat(item.total.toString());  // מוסיף את הערך של item.total לסכום
        });
        return sum;  // מחזיר את הסכום הכולל
    };

    const charge = async () => {
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

    const addMonthlyPayment = async () => {
        //כאן יתבצעו הקריאות שרת 
        console.log('Adding monthly payment:', {
            customerData,
            itemsData,
            paymentData,
            timeData,
        });
        const credit: CreditDetails.Model = {
            credit_id: '',
            client_id: customerData.customer_id,
            token: paymentData.token,
            expiry_month: paymentData.expiry_month,
            expiry_year: paymentData.expiry_year,
        }
        const creditDetails = await createCreditDetails(credit);
        const transaction: TransactionDetails.Model = {
            transaction_id: '',
            credit_id: creditDetails.credit_id,
            customer_name: customerData.first_name + ' ' + customerData.last_name,
            dates: getTheRangeOfMonths(),
            amount: getAmount(),
            total_sum: getAmount() * timeData.payments,
            belongs_to_organization: '',
            last_attempt: new Date(),
            last_success: new Date(),
            next_charge: new Date(),
            update: new Date(),
            items: itemsData,
            status: 'active',
            //קודם כל קריאת שרת בשביל לשמור את הפרטי אשראי ואז אחר כך קריאת שרת כדי לשמור את הפרטי עיסקה ואז אני יוכל לעדכן גם את הכרטיס שמקושר לעיסקה
        }
        await createTransactionDetails(transaction)
    }

    return (
        <>
            <CustomerSelector onCustomerSelect={setCustomerData} />
            <FormToAddItems onItemsChange={setItemsData} />
            <PaymentForm ref={paymentFormRef} onPaymentChange={setPaymentData} OnTimeChange={setTimeData} />
            <CustomButton
                label="שמירה"
                size={isMobile ? 'small' : 'large'}
                state='default'
                buttonType='first'
                onClick={charge}
            />
        </>
    );
};
export default AddMonthlyPayment;
