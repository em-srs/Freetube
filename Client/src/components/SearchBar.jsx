import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const onhandleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={onhandleSubmit}
      className="search-bar-container"
    >
      <input
        className="search-input"
        placeholder="Search videos, channels, topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton
        type="submit"
        sx={{
          p: '6px',
          color: '#FF1E42',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(255, 30, 66, 0.1)',
          },
        }}
        aria-label="search"
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
