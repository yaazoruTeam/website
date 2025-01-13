import { NextFunction, Request, Response } from "express";
import db from "../db";
import { TransactionDetails, HttpError } from "../model";

const createTransactionDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        TransactionDetails.sanitizeBodyExisting(req);
        const transactionDetailsrData = req.body;
        const sanitized = TransactionDetails.sanitize(transactionDetailsrData, false);
        const transactionDetails = await db.TransactionDetails.createTransactionDetails(sanitized);
        res.status(201).json(transactionDetails);
    } catch (error: any) {
        next(error);
    }
};

const getTransactionDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const transactionDetails = await db.TransactionDetails.getTransactionDetails();
        res.status(200).json(transactionDetails);
    } catch (error: any) {
        next(error);
    }
};

const getTransactionDetailsById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        TransactionDetails.sanitizeIdExisting(req);
        const existTransactionDetails = await db.TransactionDetails.doesTransactionDetailsExist(
            req.params.id
        );
        if (!existTransactionDetails) {
            const error: HttpError.Model = {
                status: 404,
                message: "TransactionDetails does not exist.",
            };
            throw error;
        }
        const transactionDetails = await db.TransactionDetails.getTransactionDetailsById(
            req.params.id
        );
        res.status(200).json(transactionDetails);
    } catch (error: any) {
        next(error);
    }
};

const updateTransactionDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        TransactionDetails.sanitizeIdExisting(req);
        TransactionDetails.sanitizeBodyExisting(req);
        const sanitized = TransactionDetails.sanitize(req.body, true);
        const updateTransactionDetails = await db.TransactionDetails.updateTransactionDetails(
            req.params.id,
            sanitized
        );
        res.status(200).json(updateTransactionDetails);
    } catch (error: any) {
        next(error);
    }
};

const deleteTransactionDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        TransactionDetails.sanitizeIdExisting(req);
        const existTransactionDetails = await db.TransactionDetails.doesTransactionDetailsExist(req.params.id);
        if (!existTransactionDetails) {
            const error: HttpError.Model = {
                status: 404,
                message: 'TransactionDetails does not exist.'
            };
            throw error;
        }
        const deleteTransactionDetails = await db.TransactionDetails.deleteTransactionDetails(req.params.id);
        res.status(200).json(deleteTransactionDetails);
    } catch (error: any) {
        next(error);
    }
};

export {
    createTransactionDetails,
    getTransactionDetails,
    getTransactionDetailsById,
    updateTransactionDetails,
    deleteTransactionDetails,
};
