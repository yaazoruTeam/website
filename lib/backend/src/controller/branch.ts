import { NextFunction, Request, Response } from 'express'
import * as db from '@db/index'
import { Branch, HttpError } from '@model'
import config from '@config/index'
import { handleError } from './err'

const limit = config.database.limit

const createBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Branch.sanitizeBodyExisting(req)
    const branchData = req.body
    const sanitized = Branch.sanitize(branchData, false)
    const branch = await db.Branch.createBranch(sanitized)
    res.status(201).json(branch)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getBranches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { branches, total } = await db.Branch.getBranches(offset)
    res.status(200).json({
      data: branches,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    handleError(error, next)
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
  } catch (error: unknown) {
    handleError(error, next)
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
    const page = parseInt(req.params.page as string, 10) || 1
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
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const updateBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Branch.sanitizeIdExisting(req)
    Branch.sanitizeBodyExisting(req)
    const sanitized = Branch.sanitize(req.body, true)
    const updateBranch = await db.Branch.updateBranch(req.params.id, sanitized)
    res.status(200).json(updateBranch)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const deleteBranch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const deleteBranch = await db.Branch.deleteBranch(req.params.id)
    res.status(200).json(deleteBranch)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

export { createBranch, getBranches, getBranchById, getBranchesByCity, updateBranch, deleteBranch }
