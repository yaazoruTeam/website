import { HttpError } from ".";

interface Model {
  credit_id: string;
  client_id: number;//???
  token: string;
  expiry_month: string;
  expiry_year: string;
}

function sanitize(creditDetails: Model, hasId: boolean): Model {
  if (hasId && !creditDetails.credit_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "credit_id".',
    };
    throw error;
  }
  if (!creditDetails.client_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "client_id".',
    };
    throw error;
  }
  if (!creditDetails.token) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "token".',
    };
    throw error;
  }
  if (!creditDetails.expiry_month) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "expiry_month".',
    };
    throw error;
  } if (!creditDetails.expiry_year) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "expiry_year".',
    };
    throw error;
  }
  const newCreditDetails: Model = {
    credit_id: creditDetails.credit_id,
    client_id: creditDetails.client_id,
    token: creditDetails.token,
    expiry_month: creditDetails.expiry_month,
    expiry_year: creditDetails.expiry_year,
  };
  return newCreditDetails;
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

export type { Model };
export {
  sanitize,
  sanitizeIdExisting,
  sanitizeBodyExisting,
};