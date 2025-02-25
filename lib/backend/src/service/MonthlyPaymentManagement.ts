import getConnection from "../db/connection"; 
import { CreditDetails, HttpError, MonthlyPayment, MonthlyPaymentManagement } from "model/src";
import db from "db";

const createMonthlyPaymentManagement = async (monthlyPayment: MonthlyPaymentManagement.Model) => {
    const knex = getConnection(); 
    const trx = await knex.transaction();
    try {
        const existCustomer = await db.Customer.doesCustomerExist(monthlyPayment.customer_id);
        if (!existCustomer) {
            const erroe: HttpError.Model = {
                status: 404,
                message: 'customer dose not exist'
            }
            throw erroe;
        }
        const sanitized = MonthlyPaymentManagement.sanitize(monthlyPayment);
        const monthlyPaymentData: MonthlyPayment.Model = await db.MonthlyPayment.createMonthlyPayment(sanitized.monthlyPayment);
        const creditDetailsData: CreditDetails.Model = await db.CreditDetails.createCreditDetails(sanitized.creditDetails);
        sanitized.paymentCreditLink.monthlyPayment_id = monthlyPaymentData.monthlyPayment_id;
        sanitized.paymentCreditLink.creditDetails_id = creditDetailsData.credit_id;
        const paymentCreditLinkData = await db.PaymentCreditLink.createPaymentCreditLink(sanitized.paymentCreditLink);
        for (const payment of sanitized.payments) {
            payment.monthlyPayment_id = monthlyPaymentData.monthlyPayment_id;
            await db.Payments.createPayments(payment); 
        }
        for (const item of sanitized.items) {
            item.monthlyPayment_id = monthlyPaymentData.monthlyPayment_id;
            await db.Item.createItem(item); 
        }
        await trx.commit();
        console.log('All actions completed successfully');
    } catch (error) {
        await trx.rollback();
        console.error('Transaction failed, all actions rolled back:', error);

        // החזרת שגיאה מסודרת
        throw new Error('Transaction failed, all actions were rolled back');
    }
}

export { createMonthlyPaymentManagement }
