export enum EntityType {
  Customer = "customer",
  Device = "device",
  Branch = "branch",
}

interface Model {
  comment_id: String;
  entity_id: string;
  entity_type: EntityType;
  content: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  created_at: Date;
}

const isOptionalString = (val: any) =>
  val === undefined || (typeof val === "string" && val.trim() !== "");

function sanitize(comment: Model, hasId: boolean): Model {
  const isString = (val: any) => typeof val === "string" && val.trim() !== "";

  if (hasId && !comment.comment_id) {
    throw { status: 400, message: 'Missing "comment_id".' };
  }

  if (!comment.entity_id || !isString(comment.entity_id)) {
    throw { status: 400, message: 'Missing or invalid "entity_id".' };
  }

  if (
    !comment.entity_type ||
    !Object.values(EntityType).includes(comment.entity_type)
  ) {
    throw {
      status: 400,
      message: `Invalid "entity_type". Must be one of: ${Object.values(
        EntityType
      ).join(", ")}.`,
    };
  }

  if (!isString(comment.content) && !isOptionalString(comment.file_url)) {
    throw {
      status: 400,
      message: 'Comment must have either "content" or "file_url".',
    };
  }

  if (comment.file_url !== undefined && !isOptionalString(comment.file_url)) {
    throw {
      status: 400,
      message: 'Invalid "file_url". Must be a string or undefined.',
    };
  }
  if (comment.file_name !== undefined && !isOptionalString(comment.file_name)) {
    throw {
      status: 400,
      message: 'Invalid "file_name". Must be a string or undefined.',
    };
  }
  if (comment.file_type !== undefined && !isOptionalString(comment.file_type)) {
    throw {
      status: 400,
      message: 'Invalid "file_type". Must be a string or undefined.',
    };
  }

  const newComment: Model = {
    comment_id: comment.comment_id,
    entity_id: comment.entity_id.trim(),
    entity_type: comment.entity_type,
    content: comment.content ? comment.content.trim() : "",
    created_at: comment.created_at,
    ...(comment.file_url && { file_url: comment.file_url.trim() }),
    ...(comment.file_name && { file_name: comment.file_name.trim() }),
    ...(comment.file_type && { file_type: comment.file_type.trim() }),
  };

  return newComment;
}

export type { Model };
export { sanitize };
