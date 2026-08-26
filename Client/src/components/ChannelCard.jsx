import React from 'react';
import { Box, CardContent, CardMedia, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import { demoProfilePicture } from '../utils/constants';

const ChannelCard = ({ channelDetail, marginTop }) => (
  <Box
    className="animate-fade-in"
    sx={{
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
      borderRadius: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      minHeight: '320px',
      margin: 'auto',
      marginTop,
      backgroundColor: '#141722',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        borderColor: 'rgba(255, 30, 66, 0.4)',
      },
    }}
  >
    <Link to={`/channel/${channelDetail?.id?.channelId || channelDetail?.id}`}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justify: 'center',
          textAlign: 'center',
          color: '#fff',
          alignItems: 'center',
        }}
      >
        <CardMedia
          image={channelDetail?.snippet?.thumbnails?.high?.url || demoProfilePicture}
          alt={channelDetail?.snippet?.title}
          sx={{
            borderRadius: '50%',
            height: '140px',
            width: '140px',
            mb: 2,
            border: '3px solid #FF1E42',
            boxShadow: '0 0 20px rgba(255, 30, 66, 0.4)',
          }}
        />
        <Typography variant="h6" fontWeight="700" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {channelDetail?.snippet?.title}
          <CheckCircleIcon sx={{ fontSize: '14px', color: '#FF1E42' }} />
        </Typography>
        {channelDetail?.statistics?.subscriberCount && (
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8', mt: 0.5 }}>
            {parseInt(channelDetail?.statistics?.subscriberCount).toLocaleString('en-US')} Subscribers
          </Typography>
        )}
      </CardContent>
    </Link>
  </Box>
);

export default ChannelCard;
