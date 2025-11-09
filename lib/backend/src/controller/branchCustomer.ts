import { NextFunction, Request, Response } from 'express'
import { BranchCustomer, HttpError } from '@model'
import { customerRepository } from '@repositories/CustomerRepository'
import config from '@config/index'
import { handleError } from './err'

const limit = config.database.limit

const createBranchCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    BranchCustomer.sanitizeBodyExisting(req)
    const branchCustomerData = req.body
    const sanitized = BranchCustomer.sanitize(branchCustomerData, false)
    // const existBranch = await db.Branch.doesBranchExist(sanitized.branch_id)
    // if (!existBranch) {
    //   const error: HttpError.Model = {
    //     status: 404,
    //     message: 'branch does not exist.',
    //   }
    //   throw error
    // }
    // const customer = await customerRepository.getCustomerById(parseInt(sanitized.customer_id))
    // if (!customer) {
    //   const error: HttpError.Model = {
    //     status: 404,
    //     message: 'customer does not exist.',
    //   }
    //   throw error
    // }
    // const existCombination = await db.BranchCustomer.doesBranchCustomerCombinationExist(
    //   sanitized.branch_id,
    //   sanitized.customer_id,
    // )
    // if (existCombination) {
    //   const error: HttpError.Model = {
    //     status: 409,
    //     message: 'branchCustomer combination already exists.',
    //   }
    //   throw error
    // }
    // const branchCustomer = await db.BranchCustomer.createBranchCustomer(sanitized)
    res.status(201).json(/*branchCustomer*/{})
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getAllBranchCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    // const { branchCustomers, total } = await db.BranchCustomer.getAllBranchCustomer(offset)

    res.status(200).json({
      data: /*branchCustomers*/[],
      page,
      totalPages: Math.ceil(/*total / limit*/0),
      total: /*total*/0,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getBranchCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    BranchCustomer.sanitizeIdExisting(req)
    // const existBranchCustomer = await db.BranchCustomer.doesBranchCustomerExist(req.params.id)
    // if (!existBranchCustomer) {
    //   const error: HttpError.Model = {
    //     status: 404,
    //     message: 'branchCustomer does not exist.',
    //   }
    //   throw error
    // }
    // const branchCustomer = await db.BranchCustomer.getBranchCustomerById(req.params.id)
    res.status(200).json(/*branchCustomer*/{})
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getBranchCustomerByBranch_id = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    BranchCustomer.sanitizeIdExisting(req)
    // const existBranch = await db.BranchCustomer.doesBranchExist(req.params.id)
    // if (!existBranch) {
    //   const error: HttpError.Model = {
    //     status: 404,
    //     message: 'branch does not exist.',
    //   }
    //   throw error
    // }
    // const { branchCustomers, total } = await db.BranchCustomer.getBranchCustomerByBranc_id(
    //   req.params.id,
    //   offset,
    // )
    res.status(200).json({
      data: /*branchCustomers*/[],
      page,
      totalPages: Math.ceil(/*total / limit*/0),
      total: /*total*/0,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const getBranchCustomerByCustomer_id = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    BranchCustomer.sanitizeIdExisting(req)
    // const existCustomer = await db.BranchCustomer.doesCustomerExist(req.params.id)
    // if (!existCustomer) {
    //   const error: HttpError.Model = {
    //     status: 404,
    //     message: 'customer does not exist.',
    //   }
    //   throw error
    // }
    // const { branchCustomers, total } = await db.BranchCustomer.getBranchCustomerByCuseomer_id(
    //   req.params.id,
    //   offset,
    // )
    res.status(200).json({
      data: /*branchCustomers*/[],
      page,
      totalPages: Math.ceil(/*total / limit*/0),
      total: /*total*/0,
    })
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const updateBranchCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    BranchCustomer.sanitizeIdExisting(req)
    BranchCustomer.sanitizeBodyExisting(req)
    const sanitized = BranchCustomer.sanitize(req.body, true)
    // const existBranch = await db.Branch.doesBranchExist(sanitized.branch_id)
    // if (!existBranch) {
    //   const error: HttpError.Model = {
    //     status: 404,
    //     message: 'branch does not exist.',
    //   }
    //   throw error
    // }
    // const customer = await customerRepository.getCustomerById(parseInt(sanitized.customer_id))
    // if (!customer) {
    //   const error: HttpError.Model = {
    //     status: 404,
    //     message: 'customer does not exist.',
    //   }
    //   throw error
    // }
    // const updateBranchCustomer = await db.BranchCustomer.updateBranchCustomer(
    //   req.params.id,
    //   sanitized,
    // )
    res.status(200).json(/*updateBranchCustomer*/{})
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const deleteBranchCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    BranchCustomer.sanitizeIdExisting(req)
    // const existBranchCustomer = await db.BranchCustomer.doesBranchCustomerExist(req.params.id)
    // if (!existBranchCustomer) {
    //   const error: HttpError.Model = {
    //     status: 404,
    //     message: 'branchCustomer does not exist.',
    //   }
    //   throw error
    // }
    // const deleteBranchCustomer = await db.BranchCustomer.deleteBranchCustomer(req.params.id)
    res.status(200).json(/*deleteBranchCustomer*/{})
  } catch (error: unknown) {
    handleError(error, next)
  }
}

export {
  createBranchCustomer,
  getAllBranchCustomer,
  getBranchCustomerById,
  getBranchCustomerByBranch_id,
  getBranchCustomerByCustomer_id,
  updateBranchCustomer,
  deleteBranchCustomer,
}
