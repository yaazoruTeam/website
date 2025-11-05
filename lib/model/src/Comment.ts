import { HttpError } from '.';

export enum EntityType {
  Customer = "customer",
  Device = "device",
  Branch = "branch",
};
interface Model {
  comment_id: number
  entity_id: number
  entity_type: EntityType
  content: string
  created_at: Date
  file_url?: string
  file_name?: string
  file_type?: string
}

const isOptionalString = (val: unknown) =>
  val === undefined || (typeof val === "string" && val.trim() !== "");

function sanitize(comment: Model, hasId: boolean): Model {
  const isString = (val: unknown) => typeof val === 'string' && val.trim() !== '';
  const isNumber = (value: unknown) => typeof value === 'number' && !isNaN(value);

  if (hasId && !isNumber(comment.comment_id)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Comment ID is required and must be a valid number.'
    };
    throw error;
  }

  if (!isNumber(comment.entity_id)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Entity ID is required and must be a valid number.'
    };
    throw error;
  }

  if (!comment.entity_type || !Object.values(EntityType).includes(comment.entity_type)) {
    const error: HttpError.Model = {
      status: 400,
      message: `Entity type "${comment.entity_type || 'undefined'}" is invalid. Allowed values are: ${Object.values(EntityType).join(', ')}.`
    };
    throw error;
  }

  if (!isString(comment.content)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Comment content is required and must be a non-empty string.'
    }
    throw error;
  }

  if (comment.file_url !== undefined && !isOptionalString(comment.file_url)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid "file_url". Must be a string or undefined.',
    };
    throw error;
  }

  if (comment.file_name !== undefined && !isOptionalString(comment.file_name)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid "file_name". Must be a string or undefined.',
    };
    throw error;
  }

  if (comment.file_type !== undefined && !isOptionalString(comment.file_type)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid "file_type". Must be a string or undefined.',
    };
    throw error;
  }

  const newComment: Model = {
    comment_id: comment.comment_id,
    entity_id: comment.entity_id,
    entity_type: comment.entity_type,
    content: comment.content ? comment.content.trim() : "",
    created_at: comment.created_at || new Date(),
    ...(comment.file_url && { file_url: comment.file_url.trim() }),
    ...(comment.file_name && { file_name: comment.file_name.trim() }),
    ...(comment.file_type && { file_type: comment.file_type.trim() }),
  };

  return newComment;
}

export { Model, sanitize };
