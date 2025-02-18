import { Request, Response, NextFunction } from "express";
import { HttpError, ItemForMonthlyPayment } from "../model";
import db from "../db";

const createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ItemForMonthlyPayment.sanitizeBodyExisting(req);
        const itemData = req.body;
        const sanitized = ItemForMonthlyPayment.sanitize(itemData, false);
        const existMonthlyPayment = await db.MonthlyPayment.doesMonthlyPaymentExist(sanitized.monthlyPayment_id);
        if (!existMonthlyPayment) {
            const erroe: HttpError.Model = {
                status: 404,
                message: 'monthly payment dose not exist'
            }
            throw erroe;
        }
        const item = await db.Item.createItem(sanitized);
        res.status(201).json(item);
    } catch (error: any) {
        next(error);
    }
};

const getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await db.Item.getItems();
        res.status(200).json(item);
    } catch (error: any) {
        next(error);
    }
};

const getItemId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ItemForMonthlyPayment.sanitizeIdExisting(req);
        const existItem = await db.Item.doesItemExist(
            req.params.id
        );
        if (!existItem) {
            const error: HttpError.Model = {
                status: 404,
                message: "Item does not exist.",
            };
            throw error;
        }
        const item = await db.Item.getItemId(req.params.id);
        res.status(200).json(item);
    } catch (error: any) {
        next(error);
    }
};

const getAllItemsByMonthlyPaymentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ItemForMonthlyPayment.sanitizeIdExisting(req);
        const existMonthlyPayment = await db.MonthlyPayment.doesMonthlyPaymentExist(
            req.params.id
        );
        if (!existMonthlyPayment) {
            const error: HttpError.Model = {
                status: 404,
                message: "monthlyPayment does not exist.",
            };
            throw error;
        }
        const items = await db.Item.getAllItemByMonthlyPaymentId(req.params.id);
        res.status(200).json(items);
    } catch (error: any) {
        next(error);
    }
};

const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ItemForMonthlyPayment.sanitizeIdExisting(req);
        ItemForMonthlyPayment.sanitizeBodyExisting(req);
        const sanitized = ItemForMonthlyPayment.sanitize(req.body, true);
        const existMonthlyPayment = await db.MonthlyPayment.doesMonthlyPaymentExist(sanitized.monthlyPayment_id);
        if (!existMonthlyPayment) {
            const erroe: HttpError.Model = {
                status: 404,
                message: 'monthly payment dose not exist'
            }
            throw erroe;
        }
        const updateItem = await db.Item.updateItem(
            req.params.id,
            sanitized
        );
        res.status(200).json(updateItem);
    } catch (error: any) {
        next(error);
    }
};

const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ItemForMonthlyPayment.sanitizeIdExisting(req);
        const existItem = await db.Item.doesItemExist(req.params.id);
        if (!existItem) {
            const error: HttpError.Model = {
                status: 404,
                message: 'Item does not exist.'
            };
            throw error;
        }
        const deleteItem = await db.Item.deleteItem(req.params.id);
        res.status(200).json(deleteItem);
    } catch (error: any) {
        next(error);
    }
};
export { createItem, getItems, getItemId, getAllItemsByMonthlyPaymentId, updateItem, deleteItem }