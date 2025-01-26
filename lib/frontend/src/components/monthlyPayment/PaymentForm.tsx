import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CustomTextField } from '../../stories/Input/Input';
import { useForm } from 'react-hook-form';
interface PaymentFormInput {
    name: string;
}
declare global {
    interface Window {
        TzlaHostedFields: any;
        fields: any;
        fieldsInitialized: any;
    }
}

const PaymentForm: React.FC = () => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [fieldsInitialized, setFieldsInitialized] = useState<boolean>(false);

    const { control } = useForm<PaymentFormInput>();


    useEffect(() => {
        if (fieldsInitialized) return; // אם השדות כבר נוצרו, אל תמשיך
        const initializeTzlaFields = () => {
            console.log('initializeTzlaFields');
            if (fieldsInitialized || window.fieldsInitialized) {
                console.log('השדות כבר נוצרו');
                return;
            }
    
            if (!fieldsInitialized && window.TzlaHostedFields) {
                window.TzlaHostedFields.create({
                    sandbox: true,
                    fields: {
                        credit_card_number: {
                            selector: '#credit_card_number',
                            placeholder: '4580 4580 4580 4580',
                            tabindex: 1
                        },
                        cvv: {
                            selector: '#cvv',
                            placeholder: '123',
                            tabindex: 2
                        },
                        expiry: {
                            selector: '#expiry',
                            placeholder: '12/21',
                            version: '1'
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
                setFieldsInitialized(true);
    
            }
        };

        if (!window.TzlaHostedFields) {
            if (document.querySelector('script[src="https://hf.tranzila.com/assets/js/thostedf.js"]')) {
                console.log('הסקריפט כבר נטען בעבר');
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://hf.tranzila.com/assets/js/thostedf.js';
            script.async = true;
            script.onload = () => {
                console.log('הסקריפט  נטען בהצלחה😊');
                initializeTzlaFields();
            };
            script.onerror = () => {
                console.error("Failed to load TzlaHostedFields script.");
            };
            document.body.appendChild(script);
        } else {
            initializeTzlaFields();
        }
    }, [fieldsInitialized]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        chargeCcData();
    };

    const chargeCcData = () => {
        const fields = window.TzlaHostedFields;
        fields.charge(
            {
                terminal_name: 'naortest', // Change to your terminal name
                requested_by_user: 'tamar peleg'
            },
            (err: any, response: any) => {
                if (err) {
                    handleErrors(err);
                }
                if (response) {
                    parseResponse(response);
                }
            }
        );
    };

    const handleErrors = (error: any) => {
        const errorMessages: { [key: string]: string } = {};
        error.messages.forEach((message: any) => {
            errorMessages[message.param] = message.message;
        });
        setErrors(errorMessages);
    };

    const parseResponse = (response: any) => {
        console.log('Response:', response);
    };


    return (
        <Box
            component="form"
            id="payment_form"
            onSubmit={handleSubmit}
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
            {/* כותרת */}
            <Typography variant="h6" sx={{ textAlign: 'center', color: '#0A425F', fontSize: 22, fontWeight: '500' }}>
                פרטי תשלום
            </Typography>

            {/* שדות פרטי כרטיס */}

            <Box
                sx={{
                    alignSelf: 'stretch',
                    height: 90,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 4, // 28px אם נרצה את אותו המרחק
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
                            style={{ width: '100%', height: '29px'}}
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
                        תוקף
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
                            id="expiry"
                            style={{ width: '100%', height: '29px'}}
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
                        מס' כרטיס
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

            {/* בלוק עם שלושה אלמנטים */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '75%' }}>
                {/* חודשיים */}
                <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1,paddingLeft:'50px' }}>
                    <CustomTextField
                        control={control}
                        label='חייב כל'
                        name='OwedAll'
                        placeholder='1 חודשיים'
                        sx={{ direction: 'rtl'}}
                    />
                </Box>

                {/* תשלומים */}
                <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1,paddingLeft:'50px'  }}>
                    <CustomTextField
                        control={control}
                        label='תשלומים'
                        name='Payments'
                        placeholder='0'
                        sx={{direction:'rtl'}}
                    />
                </Box>

                {/* תאריך התחלה */}
                <Box sx={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 ,paddingLeft:'50px' }}>
                    <CustomTextField
                        control={control}
                        label='תאריך התחלה'
                        placeholder='20/12/24'
                        name='startDate'
                        type='date'
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default PaymentForm;
