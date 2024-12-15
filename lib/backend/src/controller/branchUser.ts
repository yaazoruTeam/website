import { NextFunction, Request, Response } from 'express';
import db from "../db";
import { BranchUser, HttpError } from "@yaazoru/model";

const createBranchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchUser.sanitizeBodyExisting(req);
        const branchUserData = req.body;
        const sanitized = BranchUser.sanitize(branchUserData, false);
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

const updateBranchUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        BranchUser.sanitizeIdExisting(req);
        BranchUser.sanitizeBodyExisting(req);
        const sanitized = BranchUser.sanitize(req.body, true);
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

export { createBranchUser, getAllBranchUser, getBranchUserById, updateBranchUser, deleteBranchUser }