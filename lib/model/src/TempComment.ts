// מודל להערות זמניות לפני יצירת לקוח
export interface Model {
  content: string
  created_at: Date
  file_url?: string
  file_name?: string
  file_type?: string
}
