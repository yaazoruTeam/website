import {
  CreditDetails,
  AppError,
  RequestTypes,
  ItemForMonthlyPayment,
  MonthlyPayment,
  PaymentCreditLink,
  Payments,
} from '.'

interface Model {
  customer_id: string
  monthlyPayment: MonthlyPayment.Model
  creditDetails: CreditDetails.Model
  paymentCreditLink: PaymentCreditLink.Model
  payments: Payments.Model[]
  items: ItemForMonthlyPayment.Model[]
}

function sanitize(monthlyPaymentManagement: Model): Model {
  console.log('sanitize monthly payment management')

  if (!monthlyPaymentManagement.customer_id) {
    throw new AppError('Invalid or missing "customer_id".', 400)
  }
  const newMonthlyPaymentManagement: Model = {
    customer_id: monthlyPaymentManagement.customer_id,
    monthlyPayment: MonthlyPayment.sanitize(monthlyPaymentManagement.monthlyPayment, false),
    creditDetails: CreditDetails.sanitize(monthlyPaymentManagement.creditDetails, false),
    paymentCreditLink: {} as PaymentCreditLink.Model, //PaymentCreditLink.sanitize(monthlyPaymentManagement.paymentCreditLink, false),
    payments: monthlyPaymentManagement.payments.map((payment) => Payments.sanitize(payment, false)),
    items: monthlyPaymentManagement.items.map((item) =>
      ItemForMonthlyPayment.sanitize(item, false),
    ),
  }
  return newMonthlyPaymentManagement
}

const sanitizeIdExisting = (req: RequestTypes.RequestWithParams) => {
  if (!req.params.id) {
    throw new AppError('No ID provided', 400)
  }
}

const sanitizeBodyExisting = (req: RequestTypes.RequestWithBody) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError('No body provaider', 400)
  }
}

export type { Model }
export { sanitize, sanitizeBodyExisting, sanitizeIdExisting }
