import { EntityType } from "./Comment";

export interface CreateCommentDto {
  entity_id: string;
  entity_type: EntityType;
  content?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  created_at: string;
}
