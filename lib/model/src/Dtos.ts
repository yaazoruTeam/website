import { EntityType } from "./Comment";

interface Model {
  entity_id: string;
  entity_type: EntityType;
  content?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  created_at: string;
}

export { Model }