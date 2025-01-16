import { HttpError } from ".";

interface Model {
  transaction_id: string;
  credit_id: string;
  monthlyAmount: number;
  totalAmount: number;
  nextBillingDate: Date;
  lastBillingDate?: Date;
  status: "active" | "inactive";
}


function sanitize(transactionDetails: Model, hasId: boolean): Model {
  if (hasId && !transactionDetails.transaction_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "transaction_id".',
    };
    throw error;
  }
  if (!transactionDetails.credit_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "credit_id".',
    };
    throw error;
  }
  if (!transactionDetails.monthlyAmount) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "monthlyAmount".',
    };
    throw error;
  }
  if (!transactionDetails.totalAmount) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "totalAmount".',
    };
    throw error;
  }
  if (!transactionDetails.nextBillingDate) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "nextBillingDate".',
    };
    throw error;
  }
  if (!transactionDetails.lastBillingDate) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "lastBillingDate".',
    };
    throw error;
  }
  const newTransactionDetails: Model = {
    transaction_id: transactionDetails.transaction_id,
    credit_id: transactionDetails.credit_id,
    monthlyAmount: transactionDetails.monthlyAmount,
    totalAmount: transactionDetails.totalAmount,
    nextBillingDate: transactionDetails.nextBillingDate,
    lastBillingDate: transactionDetails.lastBillingDate,
    status: transactionDetails.status || 'active',
  };
  return newTransactionDetails;
}

const sanitizeIdExisting = (id: any) => {
  if (!id.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: "No ID provided",
    };
    throw error;
  }
};

const sanitizeBodyExisting = (req: any) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: "No body provaider",
    };
    throw error;
  }
};

export {
  Model,
  sanitize,
  sanitizeIdExisting,
  sanitizeBodyExisting,
};

