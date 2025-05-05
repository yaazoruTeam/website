import React, { useEffect, useRef, useState } from 'react';
import CustomerSelector from '../customers/CustomerSelector';
import PaymentForm from './PaymentForm';
import FormToAddItems from './FormToAddItems';
import { CustomButton } from '../designComponent/Button';
import { ItemForMonthlyPayment, MonthlyPaymentManagement } from '../../model/src';
import { useMediaQuery } from '@mui/material';
import { createMonthlyPayment } from '../../api/monthlyPaymentManagement';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/system';

interface Props {
    onBack: () => void;
}

export interface AddMonthlyPaymentFormInputs {
    full_name: string;
}

const AddMonthlyPayment: React.FC<Props> = ({ onBack }) => {
    const { t } = useTranslation();
    const [customerData, setCustomerData] = useState<any>(null); // נתוני לקוח
    const [itemsData, setItemsData] = useState<ItemForMonthlyPayment.Model[]>([]); // נתוני פריטים
    const [paymentData, setPaymentData] = useState<any>(null); // נתוני תשלום
    const [timeData, setTimeData] = useState<any>(null); // נתוני זמן ההוראת קבע
    const paymentFormRef = useRef<{ chargeCcData: () => void } | null>(null);
    const isMobile = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();

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


    const calculateEndDate = (startDate: Date, numberOfCharges: number, chargeIntervalMonths: number): Date => {
        let endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + chargeIntervalMonths * (numberOfCharges - 1));
        return endDate;
    };

    const charge = async () => {
        console.log('Adding monthly payment:', {
            customerData,
            itemsData,
            paymentData,
            timeData,
        });
        try {
            const responsePyment: any = await paymentFormRef.current?.chargeCcData();
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
        let amount = 0;
        let oneTimePayment = 0;
        itemsData.forEach(item => {
            if (item.paymentType === t('standingOrder'))
                amount += parseFloat(item.total.toString())
            if (item.paymentType === t('oneTimePayment'))
                oneTimePayment += parseFloat(item.total.toString())
        });

        const monthlyPaymentManagement: MonthlyPaymentManagement.Model = {
            customer_id: customerData.customer_id,
            monthlyPayment: {
                monthlyPayment_id: '',
                customer_id: customerData.customer_id,
                belongsOrganization: 'יעזורו',
                start_date: timeData.startDate,
                end_date: calculateEndDate(timeData.startDate, parseInt(timeData.payments), parseInt(timeData.mustEvery)),
                amount: amount,
                total_amount: amount * timeData.payments,
                oneTimePayment: oneTimePayment,
                frequency: timeData.mustEvery,
                amountOfCharges: timeData.payments,
                dayOfTheMonth: timeData.dayOfTheMonth,
                next_charge: timeData.startDate,
                last_attempt: new Date('01-01-2000'),
                last_sucsse: new Date('01-01-2000'),
                created_at: new Date(Date.now()),
                update_at: new Date(Date.now()),
                status: 'active',
            },
            creditDetails: {
                credit_id: '',
                customer_id: customerData.customer_id,
                token: paymentData.token,
                expiry_month: paymentData.expiry_month,
                expiry_year: paymentData.expiry_year,
                created_at: new Date(Date.now()),
                update_at: new Date(Date.now()),
            },
            paymentCreditLink: {
                paymentCreditLink_id: '',
                creditDetails_id: '000',
                monthlyPayment_id: '000',
                status: 'active',
            },
            payments: [],
            items: itemsData.map(item => {
                return {
                    item_id: '', // תוכל להשאיר את זה ריק אם זה נתון אוטומטי שיתמלא במסד נתונים
                    monthlyPayment_id: '10000', // שים את ה-ID של monthlyPayment כאן ברגע שיתקבל
                    description: item.description,
                    paymentType: item.paymentType,
                    price: item.price,  // מחיר לפי הנתונים שמגיעים מ- itemData
                    quantity: item.quantity,  // כמות לפי הנתונים
                    total: item.total,  // סכום כולל לפי הנתונים
                    created_at: new Date(Date.now()),  // תאריך יצירה
                    update_at: new Date(Date.now())   // תאריך עדכון
                };
            }),
        }

        try {
            const createNewMonthlyPayment = await createMonthlyPayment(monthlyPaymentManagement);
            console.log(createNewMonthlyPayment);
            alert('ההוראת קבע נוספה בהצלחה!');
            navigate('/monthlyPayment');

        } catch (error) {
            console.error('Error creating monthly payment:', error)
        }
    }

    return (
        <>
            <CustomerSelector onCustomerSelect={setCustomerData} />
            <FormToAddItems onItemsChange={setItemsData} />
            <PaymentForm ref={paymentFormRef} onPaymentChange={setPaymentData} OnTimeChange={setTimeData} />
            <Box sx={{
                direction: 'ltr',
                width: '100%',
            }}>
                <CustomButton
                    label={t('saving')}
                    size={isMobile ? 'small' : 'large'}
                    state='default'
                    buttonType='first'
                    onClick={charge}
                />
            </Box>
        </>
    );
};
export default AddMonthlyPayment;
