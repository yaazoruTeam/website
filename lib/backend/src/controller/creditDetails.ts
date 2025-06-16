import { NextFunction, Request, Response } from "express";
import * as db from "@/db";
import { CreditDetails, HttpError } from "@/model/src";

const createCreditDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    CreditDetails.sanitizeBodyExisting(req);
    const creditDetailsrData = req.body;
    const sanitized = CreditDetails.sanitize(creditDetailsrData, false);
    console.log(sanitized);

    const existCustomer = await db.Customer.doesCustomerExist(sanitized.customer_id);
    if (!existCustomer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'customer dose not exist'
      }
      throw error;
    }
    const existToken = await db.CreditDetails.doesTokenExist(sanitized.token);
    console.log('token: ', existToken);
    
    if (existToken) {
      const error: HttpError.Model = {
        status: 490,
        message: 'token already exist'
      }
      throw error;
    }
    const creditDetails = await db.CreditDetails.createCreditDetails(sanitized);
    res.status(201).json(creditDetails);
  } catch (error: any) {
    next(error);
  }
};

const getCreditDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const creditDetails = await db.CreditDetails.getCreditDetails();
    res.status(200).json(creditDetails);
  } catch (error: any) {
    next(error);
  }
};

const getCreditDetailsById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    CreditDetails.sanitizeIdExisting(req);
    const existCreditDetails = await db.CreditDetails.doesCreditDetailsExist(
      req.params.id
    );
    if (!existCreditDetails) {
      const error: HttpError.Model = {
        status: 404,
        message: "CreditDetails does not exist.",
      };
      throw error;
    }
    const creditDetails = await db.CreditDetails.getCreditDetailsById(
      req.params.id
    );
    res.status(200).json(creditDetails);
  } catch (error: any) {
    next(error);
  }
};

const updateCreditDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    CreditDetails.sanitizeIdExisting(req);
    CreditDetails.sanitizeBodyExisting(req);
    const sanitized = CreditDetails.sanitize(req.body, true);    
    const existCustomer = await db.Customer.doesCustomerExist(sanitized.customer_id);
    if (!existCustomer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'customer dose not exist'
      }
      throw error;
    }
    const updateCreditDetails = await db.CreditDetails.updateCreditDetails(
      req.params.id,
      sanitized
    );
    res.status(200).json(updateCreditDetails);
  } catch (error: any) {
    next(error);
  }
};

//לשים ❤️ שכאשר אני מוחקת כרטיס אשראי אני צריכה למחוק גם מהטבלת קשרים ולבדוק מה עם ההוראת קבע
// const deleteCreditDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         CreditDetails.sanitizeIdExisting(req);
//         const existCreditDetails = await db.CreditDetails.doesCreditDetailsExist(req.params.id);
//         if (!existCreditDetails) {
//             const error: HttpError.Model = {
//                 status: 404,
//                 message: 'CreditDetails does not exist.'
//             };
//             throw error;
//         }
//         const deleteCreditDetails = await db.CreditDetails.(req.params.id);
//         res.status(200).json(deleteCustomer);
//     } catch (error: any) {
//         next(error);
//     }
// };

export {
  createCreditDetails,
  getCreditDetails,
  getCreditDetailsById,
  updateCreditDetails,
};
