import { NextFunction, Request, Response } from 'express'
import * as db from '@db/index'
import { Branch, HttpError } from '@model'
import config from '@config/index'
import { AuditService } from '@service/auditService'

const limit = config.database.limit

const createBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Branch.sanitizeBodyExisting(req)
    const branchData = req.body
    const sanitized = Branch.sanitize(branchData, false)
    const branch = await db.Branch.createBranch(sanitized)
    
    // Create audit log for branch creation
    await AuditService.logCreate(req, AuditService.getTableName('branches'), branch.branch_id, sanitized)
    
    res.status(201).json(branch)
  } catch (error: any) {
    next(error)
  }
}

const getBranches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { branches, total } = await db.Branch.getBranches(offset)
    res.status(200).json({
      data: branches,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const getBranchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Branch.sanitizeIdExisting(req)
    const existBranch = await db.Branch.doesBranchExist(req.params.id)
    if (!existBranch) {
      const error: HttpError.Model = {
        status: 404,
        message: 'branch does not exist.',
      }
      throw error
    }
    const branch = await db.Branch.getBranchById(req.params.id)
    res.status(200).json(branch)
  } catch (error: any) {
    next(error)
  }
}

const getBranchesByCity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { city } = req.params
    if (!city) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid city.',
      }
      throw error
    }
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { branches, total } = await db.Branch.getBranchesByCity(city, offset)
    if (branches.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: `No branches found in the city: ${city}`,
      }
      throw error
    }
    res.status(200).json({
      data: branches,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const updateBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Branch.sanitizeIdExisting(req)
    Branch.sanitizeBodyExisting(req)
    
    // Get existing branch data for audit log (also validates existence)
    const existingBranchData = await db.Branch.getBranchById(req.params.id)
    if (!existingBranchData) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Branch does not exist.',
      }
      throw error
    }
    
    const sanitized = Branch.sanitize(req.body, true)
    const updateBranch = await db.Branch.updateBranch(req.params.id, sanitized)
    
    // Create audit log for branch update
    await AuditService.logUpdate(
      req, 
      AuditService.getTableName('branches'), 
      req.params.id,
      existingBranchData,
      sanitized
    )
    
    res.status(200).json(updateBranch)
  } catch (error: any) {
    next(error)
  }
}

const deleteBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Branch.sanitizeIdExisting(req)
    
    // Get branch data before deletion for audit log (also validates existence)
    const branchData = await db.Branch.getBranchById(req.params.id)
    if (!branchData) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Branch does not exist.',
      }
      throw error
    }
    
    const deleteBranch = await db.Branch.deleteBranch(req.params.id)
    
    // Create audit log for branch deletion
    await AuditService.logDelete(
      req, 
      AuditService.getTableName('branches'), 
      req.params.id,
      branchData
    )
    
    res.status(200).json(deleteBranch)
  } catch (error: any) {
    next(error)
  }
}

export { createBranch, getBranches, getBranchById, getBranchesByCity, updateBranch, deleteBranch }
