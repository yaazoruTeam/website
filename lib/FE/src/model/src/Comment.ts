import { HttpError } from '.';

export type EntityType = 'customer' | 'device' | 'branch';

const ALLOWED_ENTITY_TYPES: EntityType[] = ['customer', 'device', 'branch'];

interface Model {
  comment_id?: number;
  entity_id: string;
  entity_type: EntityType;
  content: string;
  created_at: Date;
}

function sanitize(comment: Model, hasId: boolean): Model {
  const isString = (val: any) => typeof val === 'string' && val.trim() !== '';

  if (hasId && !comment.comment_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Comment ID is required and must be a valid number.'
    };
    throw error;
  }

  if (!comment.entity_id || !isString(comment.entity_id)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Entity ID is required and must be a non-empty string.'
    };
    throw error;
  }

  if (!comment.entity_type || !ALLOWED_ENTITY_TYPES.includes(comment.entity_type)) {
    const error: HttpError.Model = {
      status: 400,
      message: `Entity type "${comment.entity_type || 'undefined'}" is invalid. Allowed values are: ${ALLOWED_ENTITY_TYPES.join(', ')}.`
    };
    throw error;
  }

  if (!isString(comment.content)) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Comment content is required and must be a non-empty string.'
    };
    throw error;
  }

  const newComment: Model = {
    comment_id: comment.comment_id,
    entity_id: comment.entity_id.trim(),
    entity_type: comment.entity_type,
    content: comment.content.trim(),
    created_at: comment.created_at,
  };

  return newComment;
}

export type { Model };
export { sanitize, ALLOWED_ENTITY_TYPES };