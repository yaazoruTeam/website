export type EntityType = 'customer' | 'device' | 'branch'

interface Model {
  comment_id: number
  entity_id: string
  entity_type: EntityType
  content: string
  created_at: Date
}

function sanitize(comment: Model, hasId: boolean): Model {
  const isString = (val: any) => typeof val === 'string' && val.trim() !== ''

  if (hasId && !comment.comment_id) {
    throw { status: 400, message: 'Missing "comment_id".' }
  }

  if (!comment.entity_id || !isString(comment.entity_id)) {
    throw { status: 400, message: 'Missing or invalid "entity_id".' }
  }

  if (
    !comment.entity_type ||
    ['customer', 'device', 'branch'].indexOf(comment.entity_type) === -1
  ) {
    throw {
      status: 400,
      message: 'Invalid "entity_type". Must be one of: customer, device, branch.',
    }
  }

  if (!isString(comment.content)) {
    throw { status: 400, message: 'Missing or invalid "content".' }
  }

  const newComment: Model = {
    comment_id: comment.comment_id,
    entity_id: comment.entity_id.trim(),
    entity_type: comment.entity_type,
    content: comment.content.trim(),
    created_at: comment.created_at,
  }

  return newComment
}

export { Model, sanitize }
