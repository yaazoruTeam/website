import { NextFunction, Request, Response } from 'express';
import db from "../db";
import { BranchCustomer, HttpError } from "@yaazoru/model";

const createBranchCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchCustomer.sanitizeBodyExisting(req);
        const branchCustomerData = req.body;
        const sanitized = BranchCustomer.sanitize(branchCustomerData, false);
        const branchCustomer = await db.BranchCustomer.createBranchCustomer(sanitized);
        res.status(201).json(branchCustomer);
    } catch (error: any) {
        next(error);
    }
};

const getAllBranchCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const allBranchCustomer = await db.BranchCustomer.getAllBranchCustomer();
        res.status(200).json(allBranchCustomer);
    } catch (error: any) {
        next(error);
    }
};

const getBranchCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchCustomer.sanitizeIdExisting(req);
        const existBranchCustomer = await db.BranchCustomer.doesBranchCustomerExist(req.params.id);
        if (!existBranchCustomer) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branchCustomer does not exist.'
            };
            throw error;
        }
        const branchCustomer = await db.BranchCustomer.getBranchCustomerById(req.params.id);
        res.status(200).json(branchCustomer);
    } catch (error: any) {
        next(error);
    }
};

const updateBranchCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchCustomer.sanitizeIdExisting(req);
        BranchCustomer.sanitizeBodyExisting(req);
        const sanitized = BranchCustomer.sanitize(req.body, true);
        const updateBranchCustomer = await db.BranchCustomer.updateBranchCustomer(req.params.id, sanitized);
        res.status(200).json(updateBranchCustomer);
    } catch (error: any) {
        next(error);
    }
};

const deleteBranchCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchCustomer.sanitizeIdExisting(req);
        const existBranchCustomer = await db.BranchCustomer.doesBranchCustomerExist(req.params.id);
        if (!existBranchCustomer) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branchCustomer does not exist.'
            };
            throw error;
        }
        const deleteBranchCustomer = await db.BranchCustomer.deleteBranchCustomer(req.params.id);
        res.status(200).json(deleteBranchCustomer);
    } catch (error: any) {
        next(error);
    }
};

export { createBranchCustomer, getAllBranchCustomer, getBranchCustomerById, updateBranchCustomer, deleteBranchCustomer }