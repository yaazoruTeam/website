import { NextFunction, Request, Response } from 'express';
import * as db from "../db";
import { Note, sanitize as sanitizeNote } from "../model/src/Note";
import { HttpError } from 'model';
import * as dotenv from 'dotenv';
dotenv.config();
const limit = Number(process.env.LIMIT) || 10;


const createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('createNote called with body:', req.body);

        const sanitized = sanitizeNote(req.body, false);
        const note = await db.Note.createNote(sanitized);
        res.status(201).json(note);
    } catch (error: any) {
        next(error);
    }
};

const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const offset = (page - 1) * limit;

        const { notes, total } = await db.Note.getNotes(offset);

        res.status(200).json({
            data: notes,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error: any) {
        next(error);
    }
};
const getNoteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const note = await db.Note.getNoteById(req.params.id);
        if (!note) {
            res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error: any) {
        next(error);
    }
};

const getNotesByEntity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('getNotesByEntity called with params:', req.params);

        const { entity_id, entity_type } = req.params;
        if (!entity_id || !entity_type) {
            const error: HttpError.Model = {
                status: 400,
                message: "entity_id and entity_type are required"
            };
            throw error;
        }

        const page = parseInt(req.query.page as string, 10) || 1;
        const offset = (page - 1) * limit;

        const { notes, total } = await db.Note.getNotesByEntity(entity_id as string, entity_type as string, offset);

        res.status(200).json({
            data: notes,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error: any) {
        next(error);
    }
};

const updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sanitized = sanitizeNote({ ...req.body, note_id: req.params.id }, true);
        const updatedNote = await db.Note.updateNote(req.params.id, sanitized);
        res.status(200).json(updatedNote);
    } catch (error: any) {
        next(error);
    }
};

const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deletedNote = await db.Note.deleteNote(req.params.id);
        res.status(200).json(deletedNote);
    } catch (error: any) {
        next(error);
    }
};

export {
    createNote,
    getNotes,
    getNoteById,
    getNotesByEntity,
    updateNote,
    deleteNote
};
