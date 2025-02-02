import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { CustomTextField } from '../../stories/Input/Input';
import { useForm } from 'react-hook-form';
interface PaymentFormInput {
    name: string;
    mustEvery: string;
    Payments: string;
    startDate: string;
}
declare global {
    interface Window {
        TzlaHostedFields: any;
        fieldsInitialized: boolean;
    }
}
let fields: any = null;

const PaymentForm = forwardRef((props: { onPaymentChange: (paymentData: any) => void, OnTimeChange: (timeData: any) => void }, ref) => {
    const { onPaymentChange } = props;
    const { OnTimeChange } = props;
    const [errors, setErrors] = useState<string[]>([]);
    const [fieldsInitialized, setFieldsInitialized] = useState<boolean>(false);
    // const terminalName = process.env.TRANZILA_TERMINAL_NAME;

    const { control, watch } = useForm<PaymentFormInput>();

    useImperativeHandle(ref, () => ({
        chargeCcData, // חושפים את הפונקציה החיונית
    }));
    const initializeTzlaFields = () => {
        console.log('מנסה לטעון שדות Tranzila...');

        if (fieldsInitialized || window.fieldsInitialized) {
            console.log('השדות כבר אותחלו בעבר.');
            return;
        }
        if (!window.TzlaHostedFields) {
            console.error('TzlaHostedFields אינו זמין.');
            return;
        }

        fields = window.TzlaHostedFields.create({
            sandbox: true,
            fields: {
                credit_card_number: {
                    selector: '#credit_card_number',
                    placeholder: 'מספר כרטיס אשראי',
                    tabindex: 1
                },
                cvv: {
                    selector: '#cvv',
                    placeholder: 'CVV',
                    tabindex: 2
                },
                expiry: {
                    selector: '#expiry',
                    placeholder: 'MM/YYYY',
                    version: '1'
                },
                identity_number: {
                    selector: '#identity_number',
                    placeholder: 'מספר תעודת זהות',
                    tabindex: 4,
                }
            },
            styles: {
                input: {
                    height: '29px',
                    width: '100%',
                    color: '#032B40'
                },
                select: {
                    height: 'auto',
                    width: 'auto'
                }
            }
        });
        console.log('tzlFields (fields):', fields);

        setFieldsInitialized(true);
        window.fieldsInitialized = true;
    };

    useEffect(() => {
        if (!window.TzlaHostedFields) {
            console.error('TzlaHostedFields לא נטען מה-scripts.');
            return;
        }

        if (!fieldsInitialized) {
            initializeTzlaFields();
        }
    }, [fieldsInitialized]);


    const chargeCcData = async () => {
        console.log('ביצוע עיסקה התחיל-----');
        if (!fields) {
            console.error('השדה fields אינו מאותחל.');
            return;
        }

        console.log('פונקציות זמינות:', Object.keys(fields));

        if (typeof fields.charge !== 'function') {
            console.error('פונקציית charge אינה זמינה ב-fields.');
            return;
        }

        return new Promise((resolve, reject) => {
            fields.charge(
                {
                    terminal_name: 'yaazoru',
                    amount: 5,
                    tran_mode: 'N',
                    tokenize: true,
                    response_language: 'Hebrew',
                },
                (err: any, response: any) => {
                    if (err) {
                        handleError(err);
                        reject(err);
                    }
                    if (response) {
                        onPaymentChange(response.transaction_response);
                        resolve(response);
                    }
                }
            );
        });
    };

    const handleError = (err: any) => {
        console.log('העסקה נכשלה.');
        const errorMessages = err.messages.map((message: any) => message.message);
        setErrors(errorMessages);
    };

    // const parseResponse = (response: any) => {
    //     console.log('העיסקה הצליחה!!');
    //     console.log('פרטי עיסקה:', response);

    //     if (response.errors) {
    //         const errorMessages = response.errors.map((error: any) => error.message);
    //         setErrors(errorMessages);
    //     } else {
    //         if (response.transaction_response.success) {
    //             //העיסקה הצליחה? זה אומר שהאימות עבר בהצלחה אז מה צריך לעשות עכשיו:
    //             //1. שמירה של הטוקן הDB ע"י קריאת שרת
    //             //2. לעדכן את כל הנתונים 
    //             onPaymentChange(response.transaction_response.success);
    //         } else {
    //             setErrors([response.transaction_response.error]);
    //         }
    //     }
    // };

    useEffect(() => {
        const subscription = watch((value) => {
            const { name, mustEvery, Payments, startDate } = value;
            console.log("timeData update:", { name, mustEvery, Payments, startDate });            
            OnTimeChange({
                name: name,
                mustEvery: mustEvery,
                payments: Payments,
                startDate: startDate
            });
        });
    
        return () => subscription.unsubscribe();
    }, [watch, OnTimeChange]); // דאג שלא יקרה שיבוש בצפייה


    return (
        <Box
            component="form"
            id="payment_form"
            sx={{
                width: 1000,
                height: '100%',
                padding: 4,
                backgroundColor: 'white',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                alignItems: 'flex-end',
            }}
        >
            <Typography variant="h6" sx={{ textAlign: 'center', color: '#0A425F', fontSize: 22, fontWeight: '500' }}>
                פרטי תשלום
            </Typography>
            <Box
                sx={{
                    alignSelf: 'stretch',
                    height: 90,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 4,
                    display: 'inline-flex',
                }}
            >
                <CustomTextField
                    control={control}
                    name='name'
                    label='שם בעל הכרטיס'
                    placeholder='שם בעל הכרטיס'
                    sx={{
                        direction: 'rtl'
                    }}
                />
                <Box
                    sx={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        gap: 1,
                        display: 'inline-flex',
                    }}
                >
                    <Typography
                        sx={{
                            color: "var(--Color-11, #032B40)",
                            textAlign: "right",
                            fontSize: "18px",
                            fontFamily: "Heebo",
                            fontWeight: 400,
                            lineHeight: "normal",
                            wordWrap: 'break-word',
                        }}
                    >
                        מס' ת.ז
                    </Typography>

                    <Box
                        sx={{
                            alignSelf: 'stretch',
                            padding: 1,
                            background: 'rgba(246, 248, 252, 0.58)',
                            borderRadius: 1,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            display: 'inline-flex',
                        }}
                    >
                        <div
                            id="identity_number"
                            style={{ width: '100%', height: '29px' }}
                        >
                        </div>
                    </Box>
                </Box>

                {/* CVV */}
                <Box
                    sx={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        gap: 1, // המרחק בין האלמנטים (8px, כי 1rem = 8px)
                        display: 'inline-flex',
                    }}
                >
                    <Typography
                        sx={{
                            color: "var(--Color-11, #032B40)",
                            textAlign: "right",
                            fontSize: "18px",
                            fontFamily: "Heebo",
                            fontWeight: 400,
                            lineHeight: "normal",
                            wordWrap: 'break-word',
                        }}
                    >
                        cvv
                    </Typography>

                    <Box
                        sx={{
                            alignSelf: 'stretch',
                            padding: 1, // 10px
                            background: 'rgba(246, 248, 252, 0.58)',
                            borderRadius: 1, // 6px
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            display: 'inline-flex',
                        }}
                    >
                        <div
                            id="cvv"
                            style={{ width: '100%', height: '29px' }}
                        >
                        </div>
                    </Box>
                </Box>

                {/* תוקף */}
                <Box
                    sx={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        gap: 1,
                        display: 'inline-flex',
                    }}
                >
                    <Typography
                        sx={{
                            color: "var(--Color-11, #032B40)",
                            textAlign: "right",
                            fontSize: "18px",
                            fontFamily: "Heebo",
                            fontWeight: 400,
                            lineHeight: "normal",
                            wordWrap: 'break-word',
                        }}
                    >
                        תוקף
                    </Typography>

                    <Box
                        sx={{
                            alignSelf: 'stretch',
                            padding: 1,
                            background: 'rgba(246, 248, 252, 0.58)',
                            borderRadius: 1,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            display: 'inline-flex',
                        }}
                    >
                        <div
                            id="expiry"
                            style={{ width: '100%', height: '29px' }}
                        >
                        </div>
                    </Box>
                </Box>

                {/* מס' כרטיס*/}
                <Box
                    sx={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        gap: 1,
                        display: 'inline-flex',
                    }}
                >
                    <Typography
                        sx={{
                            color: "var(--Color-11, #032B40)",
                            textAlign: "right",
                            fontSize: "18px",
                            fontFamily: "Heebo",
                            fontWeight: 400,
                            lineHeight: "normal",
                            wordWrap: 'break-word',
                        }}
                    >
                        מס' כרטיס
                    </Typography>

                    <Box
                        sx={{
                            alignSelf: 'stretch',
                            padding: 1,
                            background: 'rgba(246, 248, 252, 0.58)',
                            borderRadius: 1,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            display: 'inline-flex',
                        }}
                    >
                        <div
                            id="credit_card_number"
                            style={{ width: '100%', height: '29px' }}
                        >
                        </div>
                    </Box>
                </Box>
            </Box>




            <Typography
                sx={{
                    textAlign: 'center',
                    color: '#0A425F',
                    fontSize: 22,
                    fontFamily: 'Heebo',
                    fontWeight: 500,
                    lineHeight: '26.4px',
                    wordWrap: 'break-word',
                }}
            >
                תאריך חיוב
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '75%' }}>
                <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, paddingLeft: '50px' }}>
                    <CustomTextField
                        control={control}
                        label='חייב כל'
                        name='mustEvery'
                        placeholder='1 חודשיים'
                        sx={{ direction: 'rtl' }}
                    />
                </Box>

                <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, paddingLeft: '50px' }}>
                    <CustomTextField
                        control={control}
                        label='תשלומים'
                        name='Payments'
                        placeholder='0'
                        sx={{ direction: 'rtl' }}
                    />
                </Box>

                <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, paddingLeft: '50px' }}>
                    <CustomTextField
                        control={control}
                        label='תאריך התחלה'
                        placeholder='20/12/24'
                        name='startDate'
                        type='date'
                    />
                </Box>
            </Box>
            {errors && <Box><Typography>{errors}</Typography></Box>}
        </Box>
    );
});

export default PaymentForm;
