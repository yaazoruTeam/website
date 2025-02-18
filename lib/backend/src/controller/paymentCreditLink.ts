import { Request, Response, NextFunction } from "express";
import { HttpError, PaymentCreditLink } from "../model";
import db from "../db";

const createPaymentCreditLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        PaymentCreditLink.sanitizeBodyExisting(req);
        const paymentCreditLinkData = req.body;
        const sanitized = PaymentCreditLink.sanitize(paymentCreditLinkData, false);
        const existMonthlyPayment = await db.MonthlyPayment.doesMonthlyPaymentExist(sanitized.monthlyPayment_id);
        if (!existMonthlyPayment) {
            const erroe: HttpError.Model = {
                status: 404,
                message: 'monthlyPayment dose not exist'
            }
            throw erroe;
        }
        const existCreditDetails = await db.CreditDetails.doesCreditDetailsExist(sanitized.creditDetails_id);
        if (!existCreditDetails) {
            const erroe: HttpError.Model = {
                status: 404,
                message: 'creditDetails dose not exist'
            }
            throw erroe;
        }
        const existMonthlyPaymentInPaymentCreditLink = await db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink(sanitized.monthlyPayment_id);
        if (!existCreditDetails) {
            const erroe: HttpError.Model = {
                status: 409,
                message: 'monthly paymemnt already exists'
            }
            throw erroe;
        }
        const paymentCreditLink = await db.PaymentCreditLink.createPaymentCreditLink(sanitized);
        res.status(201).json(paymentCreditLink);
    } catch (error: any) {
        next(error);
    }
};

const getPaymentCreditLinks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentCreditLink = await db.PaymentCreditLink.getPaymentCreditLink();
        res.status(200).json(paymentCreditLink);
    } catch (error: any) {
        next(error);
    }
};

const getPaymentCreditLinkId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        PaymentCreditLink.sanitizeIdExisting(req);
        const existPaymentCreditLink = await db.PaymentCreditLink.doesPaymentCreditLinkExist(
            req.params.id
        );
        if (!existPaymentCreditLink) {
            const error: HttpError.Model = {
                status: 404,
                message: "PaymentCreditLink does not exist.",
            };
            throw error;
        }
        const paymentCreditLink = await db.PaymentCreditLink.getPaymentCreditLinkId(req.params.id);
        res.status(200).json(paymentCreditLink);
    } catch (error: any) {
        next(error);
    }
};
const updatePaymentCreditLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        PaymentCreditLink.sanitizeIdExisting(req);
        PaymentCreditLink.sanitizeBodyExisting(req);
        const sanitized = PaymentCreditLink.sanitize(req.body, true);
        const existMonthlyPayment = await db.MonthlyPayment.doesMonthlyPaymentExist(sanitized.monthlyPayment_id);
        if (!existMonthlyPayment) {
            const erroe: HttpError.Model = {
                status: 404,
                message: 'monthlyPayment dose not exist'
            }
            throw erroe;
        }
        const existCreditDetails = await db.CreditDetails.doesCreditDetailsExist(sanitized.creditDetails_id);
        if (!existCreditDetails) {
            const erroe: HttpError.Model = {
                status: 404,
                message: 'creditDetails dose not exist'
            }
            throw erroe;
        }
        const existMonthlyPaymentInPaymentCreditLink = await db.PaymentCreditLink.doesMonthlyPaimentExistInPaymentCreditLink(sanitized.monthlyPayment_id);
        if (!existCreditDetails) {
            const erroe: HttpError.Model = {
                status: 409,
                message: 'monthly paymemnt already exists'
            }
            throw erroe;
        }
        const updatePaymentCreditLink = await db.PaymentCreditLink.updatePaymentCreditLink(
            req.params.id,
            sanitized
        );
        res.status(200).json(updatePaymentCreditLink);
    } catch (error: any) {
        next(error);
    }
};

const deletePaymentCreditLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        PaymentCreditLink.sanitizeIdExisting(req);
        const existPaymentCreditLink = await db.PaymentCreditLink.doesPaymentCreditLinkExist(req.params.id);
        if (!existPaymentCreditLink) {
            const error: HttpError.Model = {
                status: 404,
                message: 'PaymentCreditLink does not exist.'
            };
            throw error;
        }
        const deletePaymentCreditLink = await db.PaymentCreditLink.deletePaymentCreditLink(req.params.id);
        res.status(200).json(deletePaymentCreditLink);
    } catch (error: any) {
        next(error);
    }
};
export { createPaymentCreditLink, getPaymentCreditLinks, getPaymentCreditLinkId, updatePaymentCreditLink, deletePaymentCreditLink }