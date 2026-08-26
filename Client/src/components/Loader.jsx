import React from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';

const Loader = () => (
  <Box minHeight="70vh" width="100%" p={1}>
    <Stack direction="column" justifyContent="center" alignItems="center" height="50vh" gap={2}>
      <CircularProgress
        size={48}
        thickness={4}
        sx={{
          color: '#FF1E42',
          filter: 'drop-shadow(0 0 10px rgba(255, 30, 66, 0.5))',
        }}
      />
      <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500, letterSpacing: '0.5px' }}>
        Loading Content...
      </Typography>
    </Stack>
  </Box>
);

export default Loader;
