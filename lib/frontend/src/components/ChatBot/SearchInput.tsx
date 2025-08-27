/**
 * Search input component for ChatBot
 * KAN-206: Comment search feature
 */

import React from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { colors } from '../../styles/theme';

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  placeholder = "חפש בהודעות..."
}) => {
  return (
    <Box sx={searchInputStyles.container}>
      <MagnifyingGlassIcon style={searchInputStyles.searchIcon} />
      <InputBase
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={searchInputStyles.input}
        inputProps={{
          'aria-label': 'search comments',
        }}
      />
      {searchQuery && (
        <IconButton 
          onClick={onClearSearch}
          sx={searchInputStyles.clearButton}
          size="small"
        >
          <XMarkIcon style={searchInputStyles.clearIcon} />
        </IconButton>
      )}
    </Box>
  );
};

const searchInputStyles = {
  container: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    border: `1px solid ${colors.c39}`,
    borderRadius: 1,
    padding: '6px 12px',
    margin: '8px 0',
    gap: 1,
  },
  
  searchIcon: {
    width: 18,
    height: 18,
    color: colors.c38,
    flexShrink: 0,
  },
  
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Heebo',
    color: colors.c10,
    direction: 'rtl' as const,
    textAlign: 'right' as const,
    '& .MuiInputBase-input': {
      padding: 0,
      '&::placeholder': {
        color: colors.c38,
        opacity: 1,
        textAlign: 'right',
      },
    },
  },
  
  clearButton: {
    padding: 0,
    minWidth: 'auto',
    width: 18,
    height: 18,
  },
  
  clearIcon: {
    width: 14,
    height: 14,
    color: colors.c38,
  },
};

export default SearchInput;