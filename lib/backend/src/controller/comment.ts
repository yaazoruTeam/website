import { protos, SpeechClient } from "@google-cloud/speech";
import { NextFunction, Request, Response } from 'express'
import * as db from '@db/index'
import { Comment, HttpError } from '@model'

import config from '@config/index'
import { handleError } from "./err";

let client: SpeechClient;

const googleCredentials = config.google.applicationCredentialsJson;

if (googleCredentials) {
  try {
    const credentials = JSON.parse(googleCredentials);
    client = new SpeechClient({ credentials });
  } catch (e) {
    console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", e);
    process.exit(1);
  }
} else {
  client = new SpeechClient();
}

const limit = Number(process.env.LIMIT) || config.database.limit || 10;

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("createComment called with body:", req.body);

    const sanitized = Comment.sanitize(req.body, false);
    const comment = await db.Comment.createComment(sanitized);
    res.status(201).json(comment);
  } catch (error: unknown) {
    handleError(error, next)
  }
};

const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const offset = (page - 1) * limit;

    const { comments, total } = await db.Comment.getComments(offset);

    res.status(200).json({
      data: comments,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error: unknown) {
    handleError(error, next)
  }
};

const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    // בדיקת תקינות id (שהוא מספר חיובי)
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      const error: HttpError.Model = {
        status: 400,
        message: "Invalid or missing comment id",
      };
      throw error;
    }
    const comment = await db.Comment.getCommentById(req.params.id);
    if (!comment) {
      const error: HttpError.Model = {
        status: 404,
        message: "Comment not found",
      };
      throw error;
    }
    res.status(200).json(comment);
  } catch (error: unknown) {
    handleError(error, next);
  }
};

const getCommentsByEntity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { entity_id, entity_type } = req.params;
    if (!entity_id || !entity_type) {
      const error: HttpError.Model = {
        status: 400,
        message: "entity_id and entity_type are required",
      };
      throw error;
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const offset = (page - 1) * limit;

    const { comments, total } = await db.Comment.getCommentsByEntity(
      entity_id as string,
      entity_type as string,
      offset
    );

    res.status(200).json({
      data: comments,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error: unknown) {
    handleError(error, next);
  }
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sanitized = Comment.sanitize(
      { ...req.body, comment_id: req.params.id },
      true
    );
    const updatedComment = await db.Comment.updateComment(
      req.params.id,
      sanitized
    );
    res.status(200).json(updatedComment);
  } catch (error: unknown) {
    handleError(error, next);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedComment = await db.Comment.deleteComment(req.params.id);
    res.status(200).json(deletedComment);
  } catch (error: unknown) {
    handleError(error, next);
  }
};

const transcribeAudio = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const audioBuffer = req.file?.buffer;

    if (!audioBuffer) {
      const error: HttpError.Model = {
        status: 400,
        message: "No audio provided",
      };
      next(error)
      return;
    }

    const audioBytes = audioBuffer.toString("base64");

    const [response] = await client.recognize({
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: "he-IL",
      },
    });

    const transcription = response.results
      ?.map((result: protos.google.cloud.speech.v1.ISpeechRecognitionResult) => result.alternatives?.[0].transcript)
      .join(" ")
      .trim();

    res.status(200).json({ transcription });
  } catch (error) {
    handleError(error, next);
  }
};

export {
  createComment,
  getComments,
  getCommentById,
  getCommentsByEntity,
  updateComment,
  deleteComment,
  transcribeAudio,
};
