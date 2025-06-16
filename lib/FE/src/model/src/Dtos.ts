import { EntityType } from './Comment';

export interface CreateCommentDto {
    comment_id?: number;
    entity_id: string;
    entity_type: EntityType;
    content: string;
    created_at: string;
}