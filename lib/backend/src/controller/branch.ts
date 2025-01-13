import { NextFunction, Request, Response } from 'express';
import db from "../db";
import { Branch, HttpError } from "../model";

const createBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Branch.sanitizeBodyExisting(req);
        const branchData = req.body;
        const sanitized = Branch.sanitize(branchData, false);
        const branch = await db.Branch.createBranch(sanitized);
        res.status(201).json(branch);
    } catch (error: any) {
        next(error);
    }
};

const getBranches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const branches = await db.Branch.getBranches();
        res.status(200).json(branches);
    } catch (error: any) {
        next(error);
    }
};

const getBranchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Branch.sanitizeIdExisting(req);
        const existBranch = await db.Branch.doesBranchExist(req.params.id);
        if (!existBranch) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branch does not exist.'
            };
            throw error;
        }
        const branch = await db.Branch.getBranchById(req.params.id);
        res.status(200).json(branch);
    } catch (error: any) {
        next(error);
    }
};

const updateBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Branch.sanitizeIdExisting(req);
        Branch.sanitizeBodyExisting(req);
        const sanitized = Branch.sanitize(req.body, true);
        const updateBranch = await db.Branch.updateBranch(req.params.id, sanitized);
        res.status(200).json(updateBranch);
    } catch (error: any) {
        next(error);
    }
};

const deleteBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Branch.sanitizeIdExisting(req);
        const existBranch = await db.Branch.doesBranchExist(req.params.id);
        if (!existBranch) {
            const error: HttpError.Model = {
                status: 404,
                message: 'branch does not exist.'
            };
            throw error;
        }
        const deleteBranch = await db.Branch.deleteBranch(req.params.id);
        res.status(200).json(deleteBranch);
    } catch (error: any) {
        next(error);
    }
};

export { createBranch, getBranches, getBranchById, updateBranch, deleteBranch }