import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { trackSearch } from '../utils/recommendationEngine';

const TOPIC_PRESETS = [
  'Bollywood Movies',
  'Cricket Highlights',
  'Hindi Songs',
  'Indian Tech',
  'Web Development',
  'Indian Standup Comedy',
  'Indian Gaming Live',
  'Indian News',
  'Punjabi Music',
  'Lofi Beats',
  'Fitness & Yoga',
  'Indian Food & Recipes',
];

const InterestsModal = ({ open, onClose, onInterestsUpdated }) => {
  const [selected, setSelected] = useState([
    'Bollywood Movies',
    'Cricket Highlights',
    'Indian Tech',
  ]);

  const toggleTopic = (topic) => {
    if (selected.includes(topic)) {
      setSelected(selected.filter((t) => t !== topic));
    } else {
      setSelected([...selected, topic]);
    }
  };

  const handleSave = () => {
    selected.forEach((topic) => trackSearch(topic));
    if (onInterestsUpdated) onInterestsUpdated(selected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: '#181818', color: '#fff', borderRadius: '16px' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TuneIcon sx={{ color: '#FC1503' }} /> Customize Your Feed Interests
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: '#333' }}>
        <Typography variant="body2" color="gray" mb={2}>
          Select topics you love to tailor your personalized home feed (Indian content default enabled 🇮🇳):
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {TOPIC_PRESETS.map((topic) => {
            const isSelected = selected.includes(topic);
            return (
              <Chip
                key={topic}
                label={topic}
                clickable
                onClick={() => toggleTopic(topic)}
                sx={{
                  backgroundColor: isSelected ? '#FC1503' : '#272727',
                  color: '#fff',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  '&:hover': {
                    backgroundColor: isSelected ? '#cc1102' : '#3d3d3d',
                  },
                }}
              />
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: 'gray' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#FC1503', '&:hover': { backgroundColor: '#cc1102' } }}>
          Apply & Refresh Feed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InterestsModal;
