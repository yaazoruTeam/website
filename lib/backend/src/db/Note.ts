import { Note } from "../model/src/Note";
import getConnection from "./connection";
import * as dotenv from 'dotenv';
dotenv.config();
const limit = Number(process.env.LIMIT) || 10;

const createNote = async (note: Note, trx?: any) => {
    const knex = getConnection();
    try {
        const query = trx ? trx('yaazoru.notes') : knex('yaazoru.notes');
        const [newNote] = await query
            .insert({
                entity_id: note.entity_id,
                entity_type: note.entity_type,
                content: note.content,
                created_at: note.created_at
            })
            .returning('*');
        return newNote;
    } catch (err) {
        throw err;
    }
};

const getNotes = async (offset: number): Promise<{ notes: Note[], total: number }> => {
    const knex = getConnection();
    try {
        const notes = await knex('yaazoru.notes')
            .select('*')
            .orderBy('note_id')
            .limit(limit)
            .offset(offset);

        const [{ count }] = await knex('yaazoru.notes').count('*');

        return {
            notes,
            total: parseInt(count as string, 10)
        };
    } catch (err) {
        throw err;
    }
};

const getNoteById = async (note_id: string): Promise<Note | undefined> => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.notes').where({ note_id }).first();
    } catch (err) {
        throw err;
    }
};

const getNotesByEntity = async (entity_id: string, entity_type: string, offset: number): Promise<{ notes: Note[], total: number }> => {
    const knex = getConnection();
    try {
        const notes = await knex('yaazoru.notes')
            .where({ entity_id, entity_type })
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

        const [{ count }] = await knex('yaazoru.notes')
            .where({ entity_id, entity_type })
            .count('*');

        return {
            notes,
            total: parseInt(count as string, 10)
        };
    } catch (err) {
        throw err;
    }
};

const updateNote = async (note_id: string, note: Partial<Note>): Promise<Note> => {
    const knex = getConnection();
    try {
        const [updatedNote] = await knex('yaazoru.notes')
            .where({ note_id })
            .update(note)
            .returning('*');
        if (!updatedNote) {
            throw { status: 404, message: 'Note not found' };
        }
        return updatedNote;
    } catch (err) {
        throw err;
    }
};

const deleteNote = async (note_id: string): Promise<Note> => {
    const knex = getConnection();
    try {
        const [deletedNote] = await knex('yaazoru.notes')
            .where({ note_id })
            .del()
            .returning('*');
        if (!deletedNote) {
            throw { status: 404, message: 'Note not found' };
        }
        return deletedNote;
    } catch (err) {
        throw err;
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