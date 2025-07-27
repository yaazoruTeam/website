import { Comment } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'
import { Knex } from 'knex'

const limit = config.database.limit;

const createComment = async (comment: Comment.Model, trx?: Knex.Transaction) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.comments') : knex('yaazoru.comments')
    const [newComment] = await query
      .insert({
        entity_id: comment.entity_id,
        entity_type: comment.entity_type,
        content: comment.content,
        created_at: comment.created_at,
      })
      .returning('*')
    return newComment
  } catch (err) {
    throw err
  }
}

const getComments = async (
  offset: number,
): Promise<{ comments: Comment.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const comments = await knex('yaazoru.comments')
      .select('*')
      .orderBy('comment_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.comments').count('*')

    return {
      comments,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getCommentById = async (comment_id: string): Promise<Comment.Model | undefined> => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.comments').where({ comment_id }).first()
  } catch (err) {
    throw err
  }
}

const getCommentsByEntity = async (
  entity_id: string,
  entity_type: string,
  offset: number,
): Promise<{ comments: Comment.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const comments = await knex('yaazoru.comments')
      .where({ entity_id, entity_type })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.comments').where({ entity_id, entity_type }).count('*')

    return {
      comments,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const updateComment = async (
  comment_id: string,
  comment: Partial<Comment.Model>,
): Promise<Comment.Model> => {
  const knex = getDbConnection()
  try {
    const [updatedComment] = await knex('yaazoru.comments')
      .where({ comment_id })
      .update(comment)
      .returning('*')
    if (!updatedComment) {
      throw { status: 404, message: 'Comment not found' }
    }
    return updatedComment
  } catch (err) {
    throw err
  }
}

const deleteComment = async (comment_id: string): Promise<Comment.Model> => {
  const knex = getDbConnection()
  try {
    const [deletedComment] = await knex('yaazoru.comments')
      .where({ comment_id })
      .del()
      .returning('*')
    if (!deletedComment) {
      throw { status: 404, message: 'Comment not found' }
    }
    return deletedComment
  } catch (err) {
    throw err
  }
}

export {
  createComment,
  getComments,
  getCommentById,
  getCommentsByEntity,
  updateComment,
  deleteComment,
}
