import { Request, Response, NextFunction } from "express";
import { HttpError, Payments } from "../model";
import db from "src/db";

const createPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Payments.sanitizeBodyExisting(req);
        const paymentsData = req.body;
        const sanitized = Payments.sanitize(paymentsData, false);
        const payments = await db.Payments.createPayments(sanitized);
        res.status(201).json(payments);
    } catch (error: any) {
        next(error);
    }
};

const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await db.Payments.getPayments();
        res.status(200).json(payments);
    } catch (error: any) {
        next(error);
    }
};

const getPaymentsId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Payments.sanitizeIdExisting(req);
        const existPayments = await db.Payments.doesPaymentsExist(req.params.id);
        if (!existPayments) {
            const error: HttpError.Model = {
                status: 404,
                message: "Payments does not exist.",
            };
            throw error;
        }
        const payments = await db.Payments.getPaymentsId(req.params.id);
        res.status(200).json(payments);
    } catch (error: any) {
        next(error);
    }
};
const updatePayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Payments.sanitizeIdExisting(req);
        Payments.sanitizeBodyExisting(req);
        const sanitized = Payments.sanitize(req.body, true);
        const updatePayments = await db.Payments.updatePayments(
            req.params.id,
            sanitized
        );
        res.status(200).json(updatePayments);
    } catch (error: any) {
        next(error);
    }
};

const deletePayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Payments.sanitizeIdExisting(req);
        const existPayments = await db.Payments.doesPaymentsExist(req.params.id);
        if (!existPayments) {
            const error: HttpError.Model = {
                status: 404,
                message: 'Payments does not exist.'
            };
            throw error;
        }
        const deletePayments = await db.Payments.deletePayments(req.params.id);
        res.status(200).json(deletePayments);
    } catch (error: any) {
        next(error);
    }
};
export { createPayments, getAllPayments, getPaymentsId, updatePayments, deletePayments }