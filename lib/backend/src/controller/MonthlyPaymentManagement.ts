import { Request, Response, NextFunction } from "express";
import { CreditDetails, HttpError, MonthlyPayment, MonthlyPaymentManagement } from "../model";
import db from "../db";
import getConnection from "../db/connection";

const createMonthlyPayment = async (req: Request, res: Response, next: NextFunction) => {
    const knex = getConnection();
    const trx = await knex.transaction();
    try {
        const sanitized = MonthlyPaymentManagement.sanitize(req.body);
        const existCustomer = await db.Customer.doesCustomerExist(sanitized.customer_id);
        if (!existCustomer) {
            const erroe: HttpError.Model = {
                status: 404,
                message: 'customer dose not exist'
            }
            throw erroe;
        }
        const monthlyPaymentData: MonthlyPayment.Model = await db.MonthlyPayment.createMonthlyPayment(sanitized.monthlyPayment, trx);
        const existToken = await db.CreditDetails.doesTokenExist(sanitized.creditDetails.token);
        if (existToken) {
            const erroe: HttpError.Model = {
                status: 409,
                message: 'token already exist'
            }
            throw erroe;
        };
        const creditDetailsData: CreditDetails.Model = await db.CreditDetails.createCreditDetails(sanitized.creditDetails, trx);
        sanitized.paymentCreditLink.monthlyPayment_id = monthlyPaymentData.monthlyPayment_id;
        sanitized.paymentCreditLink.creditDetails_id = creditDetailsData.credit_id;
        const paymentCreditLinkData = await db.PaymentCreditLink.createPaymentCreditLink(sanitized.paymentCreditLink, trx);
        for (const payment of sanitized.payments) {
            if (payment) {
                payment.monthlyPayment_id = monthlyPaymentData.monthlyPayment_id;
                await db.Payments.createPayments(payment, trx);
            }
        };
        for (const item of sanitized.items) {
            if (item) {
                item.monthlyPayment_id = monthlyPaymentData.monthlyPayment_id;
                await db.Item.createItem(item, trx);
            }
        };
        await trx.commit();
        console.log('i add monthly payment!! sucss!!!');
        res.status(201).json(monthlyPaymentData);
    } catch (error: any) {
        next(error);
        await trx.rollback();
        console.error('Transaction failed, all actions rolled back:', error);
        next(error);
    }
};

export { createMonthlyPayment };
