// מנגנון לשמירת הערות זמניות לפני יצירת לקוח
import { TempComment } from '@model'

class TempCommentsManager {
  private static instance: TempCommentsManager
  private tempComments: Map<string, TempComment[]> = new Map()

  static getInstance(): TempCommentsManager {
    if (!TempCommentsManager.instance) {
      TempCommentsManager.instance = new TempCommentsManager()
    }
    return TempCommentsManager.instance
  }

  addComment(tempEntityId: string, comment: TempComment): void {
    const existing = this.tempComments.get(tempEntityId) || []
    this.tempComments.set(tempEntityId, [...existing, comment])
  }

  getComments(tempEntityId: string): TempComment[] {
    const comments = this.tempComments.get(tempEntityId) || []
    return comments
  }

  clearComments(tempEntityId: string): TempComment[] {
    const comments = this.tempComments.get(tempEntityId) || []
    this.tempComments.delete(tempEntityId)
    return comments
  }

  hasComments(tempEntityId: string): boolean {
    const comments = this.tempComments.get(tempEntityId)
    return !!(comments && comments.length > 0)
  }
}

export const tempCommentsManager = TempCommentsManager.getInstance()