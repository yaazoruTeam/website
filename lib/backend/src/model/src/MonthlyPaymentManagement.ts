import { CreditDetails, HttpError, ItemForMonthlyPayment, MonthlyPayment, PaymentCreditLink, Payments } from ".";

interface Model {
    customer_id: string;
    monthlyPayment: MonthlyPayment.Model;
    creditDetails: CreditDetails.Model;
    paymentCreditLink: PaymentCreditLink.Model;
    payments: Payments.Model[];
    items: ItemForMonthlyPayment.Model[];
}


function sanitize(monthlyPaymentManagement: Model): Model {
    console.log('sanitize monthly payment management');

    if (!monthlyPaymentManagement.customer_id) {
        const error: HttpError.Model = {
            status: 400,
            message: 'Invalid or missing "customer_id".',
        };
        throw error;
    }
    const newMonthlyPaymentManagement: Model = {
        customer_id: monthlyPaymentManagement.customer_id,
        monthlyPayment: MonthlyPayment.sanitize(monthlyPaymentManagement.monthlyPayment, false),
        creditDetails: CreditDetails.sanitize(monthlyPaymentManagement.creditDetails, false),
        paymentCreditLink: PaymentCreditLink.sanitize(monthlyPaymentManagement.paymentCreditLink, false),
        payments: monthlyPaymentManagement.payments.map(payment =>
            Payments.sanitize(payment, false)
        ),
        items: monthlyPaymentManagement.items.map(item =>
            ItemForMonthlyPayment.sanitize(item, false)
        ),
    };
    return newMonthlyPaymentManagement;
}

export type { Model }
export { sanitize }