/**
 * Utility functions for ChatBot comment search functionality
 * KAN-206: Comment search feature
 */

import { Comment } from "@model";

interface ClientComment extends Comment.Model {
  isPending?: boolean;
  isAudio?: boolean;
  audioDuration?: number;
  audioUrl?: string;
}

/**
 * Filters comments based on search query
 * @param comments - Array of comments to filter
 * @param searchQuery - Search query string
 * @returns Filtered array of comments
 */
export const filterCommentsBySearch = (
  comments: ClientComment[],
  searchQuery: string
): ClientComment[] => {
  if (!searchQuery || searchQuery.trim() === '') {
    return comments;
  }

  const normalizedQuery = searchQuery.toLowerCase().trim();
  
  return comments.filter(comment => {
    // Search in comment content
    if (comment.content && comment.content.toLowerCase().includes(normalizedQuery)) {
      return true;
    }
    
    // For audio comments, search in the transcribed content as well
    if (comment.isAudio && comment.content && comment.content.toLowerCase().includes(normalizedQuery)) {
      return true;
    }
    
    return false;
  });
};

/**
 * Checks if a search query is valid
 * @param query - Search query string
 * @returns Boolean indicating if query is valid
 */
export const isValidSearchQuery = (query: string): boolean => {
  return query.trim().length >= 1;
};

/**
 * Highlights search terms in comment content
 * @param content - Comment content
 * @param searchQuery - Search query to highlight
 * @returns Content with highlighted search terms
 */
export const highlightSearchTerms = (content: string, searchQuery: string): string => {
  if (!searchQuery || !isValidSearchQuery(searchQuery)) {
    return content;
  }
  
  const normalizedQuery = searchQuery.trim();
  const regex = new RegExp(`(${normalizedQuery})`, 'gi');
  
  return content.replace(regex, '<mark>$1</mark>');
};