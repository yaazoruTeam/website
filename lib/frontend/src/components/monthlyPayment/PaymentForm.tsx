import React, { useEffect, useState } from 'react';

const PaymentForm: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    // פונקציה ליצירת השדות של טרנזילה
    const initializeTzlaFields = () => {
        if (window.TzlaHostedFields) {
            window.TzlaHostedFields.create({
                sandbox: true,
                fields: {
                    credit_card_number: {
                        selector: '#credit_card_number',
                        placeholder: '4580 4580 4580 4580',
                        tabindex: 1,
                    },
                    cvv: {
                        selector: '#cvv',
                        placeholder: '123',
                        tabindex: 2,
                    },
                    expiry: {
                        selector: '#expiry',
                        placeholder: '12/21',
                        version: '1',
                    },
                },
                styles: {
                    input: {
                        height: 'auto',
                        width: 'auto',
                    },
                    select: {
                        height: 'auto',
                        width: 'auto',
                    },
                },
            });
        }
    };
    useEffect(() => {        
        if (!window.TzlaHostedFields) {
            const script = document.createElement('script');
            script.src = "https://hf.tranzila.com/assets/js/thostedf.js";
            script.async = true;
            script.onload = () => {
                console.log("הסקריפט נטען בהצלחה!");
                initializeTzlaFields();
            };
            script.onerror = () => {
                console.error("לא ניתן היה לטעון את הסקריפט!");
            };
            document.body.appendChild(script);
        } else {
            initializeTzlaFields();
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        chargeCcData();
    };

    const chargeCcData = () => {
        const fields = window.TzlaHostedFields;  
        fields.charge(
            {
                terminal_name: 'naortest',
                amount,
                requested_by_user: 'tamar peleg',
            },
            (err: any, response: any) => {
                if (err) {
                    handleErrors(err);
                }
                if (response) {
                    console.log(response);
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

    return (
        <form id="payment_form" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="credit_card_number">מספר כרטיס אשראי</label>
                <div id="credit_card_number" className="form-control"></div>
                <div id="errors_for_number" className="error_message">{errors.credit_card_number}</div>
            </div>

            <div>
                <label htmlFor="expiry">תוקף</label>
                <div id="expiry" className="form-control"></div>
                <div id="errors_for_expiry" className="error_message">{errors.expiry}</div>
            </div>

            <div>
                <label htmlFor="cvv">CVV</label>
                <div id="cvv" className="form-control"></div>
                <div id="errors_for_cvv" className="error_message">{errors.cvv}</div>
            </div>

            <div>
                <label htmlFor="amount">סכום תשלום</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100"
                    required
                />
            </div>

            <button type="submit">שלם עכשיו</button>
        </form>
    );
};

export default PaymentForm;
