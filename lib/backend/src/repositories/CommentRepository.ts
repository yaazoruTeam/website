import { Repository, In } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Comment, EntityType } from '../entities/Comment'
import logger from '../utils/logger'
import config from '../config/index'

const limit = config.database.limit

/**
 * CommentRepository - Handles all database operations for comments
 * TypeORM-based repository for modern, type-safe database operations
 */
export class CommentRepository {
  private repository: Repository<Comment>

  constructor() {
    this.repository = AppDataSource.getRepository(Comment)
  }

  /**
   * Create a new comment
   * @param {Partial<Comment>} commentData - Data for the comment.
   *   Note: While the type is Partial, the database schema requires entity_id, entity_type, and content.
   *   Missing required fields will cause a database constraint violation.
   *   Optional fields: file_url, file_name, file_type.
   * @returns {Promise<Comment>} The newly created Comment entity.
   * @throws {Error} Database error if required fields are missing or constraint violations occur
   */
  async createComment(commentData: Partial<Comment>): Promise<Comment> {
    try {
      logger.debug('[DB] Creating comment in database', {
        entity_id: commentData.entity_id,
        entity_type: commentData.entity_type,
      })

      const comment = this.repository.create(commentData)
      const savedComment = await this.repository.save(comment)

      logger.debug('[DB] Comment created successfully', {
        comment_id: savedComment.comment_id,
      })
      return savedComment
    } catch (err) {
      logger.error('[DB] Database error creating comment:', err)
      throw err
    }
  }

  /**
   * Get comments with pagination
   * @param {number} offset - The number of records to skip for pagination
   * @returns {Promise<{ comments: Comment[]; total: number }>} Object containing array of comments and total count
   */
  async getComments(offset: number): Promise<{ comments: Comment[]; total: number }> {
    try {
      logger.debug('[DB] Fetching comments from database', { offset, limit })

      const [comments, total] = await this.repository.findAndCount({
        skip: offset,
        take: limit,
        order: { created_at: 'DESC' },
      })

      return { comments, total }
    } catch (err) {
      logger.error('[DB] Database error fetching comments:', err)
      throw err
    }
  }

  /**
   * Get comment by ID
   * @param {number} comment_id - The comment ID to retrieve
   * @returns {Promise<Comment | null>} A Promise that resolves to the Comment object if found, or null if not found.
   */
  async getCommentById(comment_id: number): Promise<Comment | null> {
    try {
      logger.debug('[DB] Fetching comment by ID', { comment_id })

      const comment = await this.repository.findOne({
        where: { comment_id },
      })

      return comment || null
    } catch (err) {
      logger.error('[DB] Database error fetching comment by ID:', err)
      throw err
    }
  }

  /**
   * Get all comments for a specific entity
   * @param {number} entity_id - The ID of the entity (customer, device, or branch)
   * @param {EntityType} entity_type - The type of entity
   * @param {number} offset - The number of records to skip for pagination
   * @returns {Promise<{ comments: Comment[]; total: number }>} Object containing comments for the entity and total count
   */
  async getCommentsByEntity(
    entity_id: number,
    entity_type: EntityType,
    offset: number
  ): Promise<{ comments: Comment[]; total: number }> {
    try {
      logger.debug('[DB] Fetching comments for entity', { entity_id, entity_type })

      const [comments, total] = await this.repository.findAndCount({
        where: { entity_id, entity_type },
        skip: offset,
        take: limit,
        order: { created_at: 'DESC' },
      })

      return { comments, total }
    } catch (err) {
      logger.error('[DB] Database error fetching comments by entity:', err)
      throw err
    }
  }

  /**
   * Update comment
   * @param {number} comment_id - The ID of the comment to update
   * @param {Partial<Comment>} updateData - Partial comment data to update
   * @returns {Promise<Comment>} Updated comment
   * @throws {Error} Throws a 404 error if the comment is not found
   */
  async updateComment(
    comment_id: number,
    updateData: Partial<Comment>
  ): Promise<Comment> {
    try {
      logger.debug('[DB] Updating comment in database', { comment_id })

      const result = await this.repository.update(comment_id, updateData)

      if (!result.affected) {
        logger.warn('[DB] Comment not found for update', { comment_id })
        throw { status: 404, message: 'Comment not found' }
      }

      const updatedComment = await this.getCommentById(comment_id)

      logger.debug('[DB] Comment updated successfully', { comment_id })
      return updatedComment!
    } catch (err) {
      logger.error('[DB] Database error updating comment:', err)
      throw err
    }
  }

  /**
   * Delete comment
   * @param {number} comment_id - The ID of the comment to delete
   * @returns {Promise<void>}
   * @throws {Error} Throws a 404 error if the comment is not found
   */
  async deleteComment(comment_id: number): Promise<void> {
    try {
      logger.debug('[DB] Deleting comment', { comment_id })

      const result = await this.repository.delete(comment_id)

      if (!result.affected) {
        logger.warn('[DB] Comment not found for deletion', { comment_id })
        throw { status: 404, message: 'Comment not found' }
      }

      logger.debug('[DB] Comment deleted successfully', { comment_id })
    } catch (err) {
      logger.error('[DB] Database error deleting comment:', err)
      throw err
    }
  }
}

// Export singleton instance
export const commentRepository = new CommentRepository()
