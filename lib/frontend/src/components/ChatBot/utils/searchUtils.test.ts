/**
 * Tests for ChatBot search utility functions
 * KAN-206: Comment search feature
 */

import { filterCommentsBySearch, isValidSearchQuery, highlightSearchTerms } from '../utils/searchUtils';

type ClientComment = {
  comment_id: string;
  entity_id: string;
  entity_type: any;
  content: string;
  created_at: Date;
  isPending?: boolean;
  isAudio?: boolean;
  audioDuration?: number;
  audioUrl?: string;
};

describe('ChatBot Search Utils', () => {
  const mockComments: ClientComment[] = [
    {
      comment_id: '1',
      entity_id: 'customer-1',
      entity_type: 'customer' as any,
      content: 'Hello world, this is a test message',
      created_at: new Date('2023-01-01'),
    },
    {
      comment_id: '2',
      entity_id: 'customer-1',
      entity_type: 'customer' as any,
      content: 'Another message with different content',
      created_at: new Date('2023-01-02'),
    },
    {
      comment_id: '3',
      entity_id: 'customer-1',
      entity_type: 'customer' as any,
      content: 'Audio transcription: hello everyone',
      created_at: new Date('2023-01-03'),
      isAudio: true,
    }
  ];

  describe('filterCommentsBySearch', () => {
    it('should return all comments when search query is empty', () => {
      const result = filterCommentsBySearch(mockComments, '');
      expect(result).toEqual(mockComments);
      
      const result2 = filterCommentsBySearch(mockComments, '   ');
      expect(result2).toEqual(mockComments);
    });

    it('should filter comments based on content', () => {
      const result = filterCommentsBySearch(mockComments, 'test');
      expect(result).toHaveLength(1);
      expect(result[0].comment_id).toBe('1');
    });

    it('should be case insensitive', () => {
      const result = filterCommentsBySearch(mockComments, 'HELLO');
      expect(result).toHaveLength(2);
      expect(result.map(c => c.comment_id)).toEqual(['1', '3']);
    });

    it('should search in audio comment content', () => {
      const result = filterCommentsBySearch(mockComments, 'transcription');
      expect(result).toHaveLength(1);
      expect(result[0].comment_id).toBe('3');
      expect(result[0].isAudio).toBe(true);
    });

    it('should handle special characters in search query', () => {
      const result = filterCommentsBySearch(mockComments, 'hello:');
      expect(result).toHaveLength(1);
      expect(result[0].comment_id).toBe('3');
    });
  });

  describe('isValidSearchQuery', () => {
    it('should return true for valid queries', () => {
      expect(isValidSearchQuery('test')).toBe(true);
      expect(isValidSearchQuery('a')).toBe(true);
      expect(isValidSearchQuery(' test ')).toBe(true);
    });

    it('should return false for invalid queries', () => {
      expect(isValidSearchQuery('')).toBe(false);
      expect(isValidSearchQuery('   ')).toBe(false);
    });
  });

  describe('highlightSearchTerms', () => {
    it('should highlight matching terms', () => {
      const result = highlightSearchTerms('Hello world test', 'test');
      expect(result).toContain('<mark>test</mark>');
    });

    it('should be case insensitive', () => {
      const result = highlightSearchTerms('Hello World Test', 'hello');
      expect(result).toContain('<mark>Hello</mark>');
    });

    it('should return original content when no search query', () => {
      const content = 'Hello world';
      expect(highlightSearchTerms(content, '')).toBe(content);
      expect(highlightSearchTerms(content, '   ')).toBe(content);
    });
  });
});