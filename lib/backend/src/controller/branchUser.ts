import { NextFunction, Request, Response } from 'express';
import db from "../db";
import { BranchUser, HttpError } from "../model";

const createBranchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchUser.sanitizeBodyExisting(req);
        const branchUserData = req.body;
        const sanitized = BranchUser.sanitize(branchUserData, false);
        const existBranch = await db.Branch.doesBranchExist(sanitized.branch_id);
        if (!existBranch) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branch does not exist.'
            };
            throw error;
        }
        const existUser = await db.User.doesUserExist(sanitized.user_id);
        if (!existUser) {
            const error: HttpError.Model = {
                status: 404,
                message: 'user does not exist.'
            };
            throw error;
        }
        const existCombination = await db.BranchUser.doesBranchUserCombinationExist(sanitized.branch_id, sanitized.user_id);
        if (existCombination) {
            const error: HttpError.Model = {
                status: 409,
                message: 'branchUser combination already exists.'
            };
            throw error;
        }
        const branchUser = await db.BranchUser.createBranchUser(sanitized);
        res.status(201).json(branchUser);
    } catch (error: any) {
        next(error);
    }
};

const getAllBranchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const branchUser = await db.BranchUser.getAllBranchUser();
        res.status(200).json(branchUser);
    } catch (error: any) {
        next(error);
    }
};

const getBranchUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchUser.sanitizeIdExisting(req);
        const existBranchUser = await db.BranchUser.doesBranchUserExist(req.params.id);
        if (!existBranchUser) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branchUser does not exist.'
            };
            throw error;
        }
        const branchUser = await db.BranchUser.getBranchUserById(req.params.id);
        res.status(200).json(branchUser);
    } catch (error: any) {
        next(error);
    }
};

const getBranchUserByBranch_id = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchUser.sanitizeIdExisting(req);
        const existBranch = await db.BranchUser.doesBranchExist(req.params.id);
        if (!existBranch) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branch does not exist.'
            };
            throw error;
        }
        const branchUser = await db.BranchUser.getBranchUserByBranch_id(req.params.id);
        res.status(200).json(branchUser);
    } catch (error: any) {
        next(error);
    }
};

const getBranchUserByUser_id = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchUser.sanitizeIdExisting(req);
        const existUser = await db.BranchUser.doesUserExist(req.params.id);
        if (!existUser) {
            const error: HttpError.Model = {
                status: 404,
                message: 'user does not exist.'
            };
            throw error;
        }
        const branchuser = await db.BranchUser.getBranchUserByUser_id(req.params.id);
        res.status(200).json(branchuser);
    } catch (error: any) {
        next(error);
    }
};

const updateBranchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchUser.sanitizeIdExisting(req);
        BranchUser.sanitizeBodyExisting(req);
        const sanitized = BranchUser.sanitize(req.body, true);
        const existBranch = await db.Branch.doesBranchExist(sanitized.branch_id);
        if (!existBranch) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branch does not exist.'
            };
            throw error;
        }
        const existUser = await db.User.doesUserExist(sanitized.user_id);
        if (!existUser) {
            const error: HttpError.Model = {
                status: 404,
                message: 'user does not exist.'
            };
            throw error;
        }
        const updateBranchUser = await db.BranchUser.updateBranchUser(req.params.id, sanitized);
        res.status(200).json(updateBranchUser);
    } catch (error: any) {
        next(error);
    }
};

const deleteBranchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchUser.sanitizeIdExisting(req);
        const existBranchUser = await db.BranchUser.doesBranchUserExist(req.params.id);
        if (!existBranchUser) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branchUser does not exist.'
            };
            throw error;
        }
        const deleteBranchUser = await db.BranchUser.deleteBranchUser(req.params.id);
        res.status(200).json(deleteBranchUser);
    } catch (error: any) {
        next(error);
    }
};

export {
    createBranchUser,
    getAllBranchUser, getBranchUserById,
    getBranchUserByBranch_id,
    getBranchUserByUser_id,
    updateBranchUser,
    deleteBranchUser,
}