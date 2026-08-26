import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Chip } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getStoredUser, signOut, requestGoogleAuth } from '../utils/youtubeAuth';

const ConnectYouTubeBtn = ({ onAuthChange }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleConnect = () => {
    requestGoogleAuth(
      (data) => {
        setUser(getStoredUser());
        if (onAuthChange) onAuthChange(data);
      },
      (err) => {
        console.warn('YouTube Connect notice:', err);
        // Soft fallback alert if no Google Client ID configured
        alert('To connect your live YouTube account, please configure REACT_APP_GOOGLE_CLIENT_ID. Vision Hub is currently using client-side local interest learning!');
      }
    );
  };

  const handleDisconnect = () => {
    signOut();
    setUser(null);
    if (onAuthChange) onAuthChange(null);
  };

  if (user?.connected) {
    return (
      <Tooltip title="Connected to YouTube (Client-Side)">
        <Chip
          icon={<YouTubeIcon style={{ color: '#FF0000' }} />}
          label="YouTube Synced"
          onDelete={handleDisconnect}
          deleteIcon={<CheckCircleIcon />}
          sx={{
            backgroundColor: '#272727',
            color: '#fff',
            fontWeight: 'bold',
            '& .MuiChip-deleteIcon': { color: '#4caf50' },
          }}
        />
      </Tooltip>
    );
  }

  return (
    <Button
      variant="outlined"
      startIcon={<YouTubeIcon />}
      onClick={handleConnect}
      sx={{
        color: '#fff',
        borderColor: '#CC0000',
        borderRadius: '20px',
        textTransform: 'none',
        fontSize: '12px',
        fontWeight: 'bold',
        px: 2,
        py: 0.5,
        '&:hover': {
          backgroundColor: '#CC0000',
          borderColor: '#CC0000',
        },
      }}
    >
      Sync YouTube Account
    </Button>
  );
};

export default ConnectYouTubeBtn;
