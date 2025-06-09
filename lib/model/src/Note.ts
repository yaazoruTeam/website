
export type EntityType = 'customer' | 'device' | 'branch';

interface Note {
    note_id: number;
    entity_id: string;
    entity_type: EntityType;
    content: string;
    created_at: Date;
}

function sanitize(note: Note, hasId: boolean): Note {
    const isString = (val: any) => typeof val === 'string' && val.trim() !== '';

    if (hasId && !note.note_id) {
        throw { status: 400, message: 'Missing "note_id".' };
    }

    if (!note.entity_id || !isString(note.entity_id)) {
        throw { status: 400, message: 'Missing or invalid "entity_id".' };
    }

    if (!note.entity_type || ['customer', 'device', 'branch'].indexOf(note.entity_type) === -1) {
        throw { status: 400, message: 'Invalid "entity_type". Must be one of: customer, device, branch.' };
    }

    if (!isString(note.content)) {
        throw { status: 400, message: 'Missing or invalid "content".' };
    }

    const newNote: Note = {
        note_id: note.note_id,
        entity_id: note.entity_id.trim(),
        entity_type: note.entity_type,
        content: note.content.trim(),
        created_at: note.created_at,
    };

    return newNote;
}

export { Note, sanitize };
