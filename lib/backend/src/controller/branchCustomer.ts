import { NextFunction, Request, Response } from 'express';
import * as db from "@/db";
import { BranchCustomer, HttpError } from "@/model/src";

const createBranchCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchCustomer.sanitizeBodyExisting(req);
        const branchCustomerData = req.body;
        const sanitized = BranchCustomer.sanitize(branchCustomerData, false);
        const existBranch = await db.Branch.doesBranchExist(sanitized.branch_id);
        if (!existBranch) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branch does not exist.'
            };
            throw error;
        }
        const existCustomer = await db.Customer.doesCustomerExist(sanitized.customer_id);
        if (!existCustomer) {
            const error: HttpError.Model = {
                status: 404,
                message: 'customer does not exist.'
            };
            throw error;
        }
        const existCombination = await db.BranchCustomer.doesBranchCustomerCombinationExist(sanitized.branch_id, sanitized.customer_id);
        if (existCombination) {
            const error: HttpError.Model = {
                status: 409,
                message: 'branchCustomer combination already exists.'
            };
            throw error;
        }
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

const getBranchCustomerByBranch_id = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchCustomer.sanitizeIdExisting(req);
        const existBranch = await db.BranchCustomer.doesBranchExist(req.params.id);
        if (!existBranch) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branch does not exist.'
            };
            throw error;
        }
        const branchCustomer = await db.BranchCustomer.getBranchCustomerByBranc_id(req.params.id);
        res.status(200).json(branchCustomer);
    } catch (error: any) {
        next(error);
    }
};

const getBranchCustomerByCustomer_id = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchCustomer.sanitizeIdExisting(req);
        const existCustomer = await db.BranchCustomer.doesCustomerExist(req.params.id);
        if (!existCustomer) {
            const error: HttpError.Model = {
                status: 404,
                message: 'customer does not exist.'
            };
            throw error;
        }
        const branchCustomer = await db.BranchCustomer.getBranchCustomerByCuseomer_id(req.params.id);
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
        const existBranch = await db.Branch.doesBranchExist(sanitized.branch_id);
        if (!existBranch) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branch does not exist.'
            };
            throw error;
        }
        const existCustomer = await db.Customer.doesCustomerExist(sanitized.customer_id);
        if (!existCustomer) {
            const error: HttpError.Model = {
                status: 404,
                message: 'customer does not exist.'
            };
            throw error;
        }
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

export {
    createBranchCustomer,
    getAllBranchCustomer,
    getBranchCustomerById,
    getBranchCustomerByBranch_id,
    getBranchCustomerByCustomer_id,
    updateBranchCustomer,
    deleteBranchCustomer,
}