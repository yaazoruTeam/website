import { NextFunction, Request, Response } from 'express'
import * as db from '../db'
import { Comment } from '../model'
import { HttpError } from 'model'
import * as dotenv from 'dotenv'
dotenv.config()
const limit = Number(process.env.LIMIT) || 10

const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('createComment called with body:', req.body)

    const sanitized = Comment.sanitize(req.body, false)
    const comment = await db.Comment.createComment(sanitized)
    res.status(201).json(comment)
  } catch (error: any) {
    next(error)
  }
}

const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { comments, total } = await db.Comment.getComments(offset)

    res.status(200).json({
      data: comments,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const getCommentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    // בדיקת תקינות id (שהוא מספר חיובי)
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid or missing comment id',
      }
      throw error
    }
    const comment = await db.Comment.getCommentById(req.params.id)
    if (!comment) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Comment not found',
      }
      throw error
    }
    res.status(200).json(comment)
  } catch (error: any) {
    next(error)
  }
}

const getCommentsByEntity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    console.log('getCommentsByEntity called with params:', req.params)

    const { entity_id, entity_type } = req.params
    if (!entity_id || !entity_type) {
      const error: HttpError.Model = {
        status: 400,
        message: 'entity_id and entity_type are required',
      }
      throw error
    }

    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    const { comments, total } = await db.Comment.getCommentsByEntity(
      entity_id as string,
      entity_type as string,
      offset,
    )

    res.status(200).json({
      data: comments,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sanitized = Comment.sanitize({ ...req.body, comment_id: req.params.id }, true)
    const updatedComment = await db.Comment.updateComment(req.params.id, sanitized)
    res.status(200).json(updatedComment)
  } catch (error: any) {
    next(error)
  }
}

const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedComment = await db.Comment.deleteComment(req.params.id)
    res.status(200).json(deletedComment)
  } catch (error: any) {
    next(error)
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
