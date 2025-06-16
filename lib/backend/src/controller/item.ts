import { Request, Response, NextFunction } from "express";
import { HttpError, ItemForMonthlyPayment } from "@/model/src";
import * as db from "@/db";

const createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ItemForMonthlyPayment.sanitizeBodyExisting(req);
        const itemData = req.body;
        const sanitized = ItemForMonthlyPayment.sanitize(itemData, false);
        const existMonthlyPayment = await db.MonthlyPayment.doesMonthlyPaymentExist(sanitized.monthlyPayment_id);
        if (!existMonthlyPayment) {
            const error: HttpError.Model = {
                status: 404,
                message: 'monthly payment dose not exist'
            }
            throw error;
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
            const error: HttpError.Model = {
                status: 404,
                message: 'monthly payment dose not exist'
            }
            throw error;
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

const updateItems = async (existingItems: ItemForMonthlyPayment.Model[], updatedItems: ItemForMonthlyPayment.Model[], trx: any) => {
    // 1. חפש פריטים שנמחקו - פריטים קיימים שלא נמצאים במערך החדש
    const deletedItems = existingItems.filter(existingItem =>
        !updatedItems.some(updatedItem => updatedItem.item_id === existingItem.item_id)
    );

    // 2. מחוק את הפריטים שנמחקו
    for (const deletedItem of deletedItems) {
        await db.Item.deleteItem(deletedItem.item_id, trx);
    }

    // 3. עדכן פריטים קיימים או הוסף חדשים
    for (const updatedItem of updatedItems) {
        const existingItem = existingItems.find(existingItem => existingItem.item_id === updatedItem.item_id);
        if (existingItem) {
            // אם הפריט קיים, עדכן אותו
            await db.Item.updateItem(updatedItem.item_id, updatedItem, trx);
        } else {
            // אם זה פריט חדש, צור אותו
            await db.Item.createItem(updatedItem, trx);
        }
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
export { createItem, getItems, getItemId, getAllItemsByMonthlyPaymentId, updateItem, updateItems, deleteItem }