import { HttpError, ItemForMonthlyPayment } from '.'

interface Model {
  transaction_id: string
  credit_id: string
  customer_name: string //שם לקוח
  dates: string //תאריכים
  amount: number //(חודשי)סכום
  total_sum: number //סה"כ
  belongs_to_organization: string //שייל לאירגון
  last_attempt: Date //נסיון אחרון
  last_success: Date //הצלחה אחרונה
  next_charge: Date //החיוב הבא
  update: Date //עידכון
  items: ItemForMonthlyPayment.Model[] //פריטים
  credit: {
    token: string
    expiry_month: string
    expiry_year: string
    cvv: string
  }
  status: 'active' | 'inactive'
}

function sanitize(transactionDetails: Model, hasId: boolean): Model {
  if (hasId && !transactionDetails.transaction_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "transaction_id".',
    }
    throw error
  }
  // if (!transactionDetails.credit_id) {
  //   const error: HttpError.Model = {
  //     status: 400,
  //     message: 'Invalid or missing "credit_id".',
  //   };
  //   throw error;
  // }
  if (!transactionDetails.customer_name) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "customer_name".',
    }
    throw error
  }
  if (!transactionDetails.dates) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "dates".',
    }
    throw error
  }
  if (!transactionDetails.amount) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "amount".',
    }
    throw error
  }
  if (!transactionDetails.total_sum) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "total_sum".',
    }
    throw error
  }
  if (!transactionDetails.belongs_to_organization) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "belongs_to_organization".',
    }
    throw error
  }
  if (!transactionDetails.last_attempt) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "last_attempt".',
    }
    throw error
  }
  if (!transactionDetails.last_success) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "last_success".',
    }
    throw error
  }
  if (!transactionDetails.next_charge) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "next_charge".',
    }
    throw error
  }
  if (!transactionDetails.update) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "update".',
    }
    throw error
  }
  if (!transactionDetails.items) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "items".',
    }
    throw error
  }
  if (!transactionDetails.credit) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "credit".',
    }
    throw error
  }
  if (!transactionDetails.credit.token) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "credit-token".',
    }
    throw error
  }
  if (!transactionDetails.credit.expiry_year || transactionDetails.credit.expiry_month) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "credit-date".',
    }
    throw error
  }
  if (!transactionDetails.credit.cvv) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "credit-cvv".',
    }
    throw error
  }
  const newTransactionDetails: Model = {
    transaction_id: transactionDetails.transaction_id,
    credit_id: transactionDetails.credit_id,
    customer_name: transactionDetails.customer_name,
    dates: transactionDetails.dates,
    amount: transactionDetails.amount,
    total_sum: transactionDetails.total_sum,
    belongs_to_organization: transactionDetails.belongs_to_organization,
    last_attempt: transactionDetails.last_attempt,
    last_success: transactionDetails.last_success,
    next_charge: transactionDetails.next_charge,
    update: transactionDetails.update,
    items: transactionDetails.items,
    credit: {
      cvv: transactionDetails.credit.cvv,
      expiry_month: transactionDetails.credit.expiry_month,
      expiry_year: transactionDetails.credit.expiry_year,
      token: transactionDetails.credit.token,
    },
    status: transactionDetails.status || 'active',
  }
  return newTransactionDetails
}

const sanitizeIdExisting = (id: any) => {
  if (!id.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: any) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provaider',
    }
    throw error
  }
}

export type { Model }
export { sanitize, sanitizeIdExisting, sanitizeBodyExisting }
