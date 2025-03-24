import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const CreatePoll = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const [pollData, setPollData] = useState({
    title: '',
    description: '',
    options: [{ id: '1', text: '' }, { id: '2', text: '' }]
  });

  const handleOptionChange = (id, value) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.id === id ? { ...opt, text: value } : opt
      )
    }));
  };

  const addOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, { id: String(prev.options.length + 1), text: '' }]
    }));
  };

  const removeOption = (id) => {
    if (pollData.options.length > 2) {
      setPollData(prev => ({
        ...prev,
        options: prev.options.filter(opt => opt.id !== id)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate a unique ID for the poll
    const pollId = Date.now().toString();
    
    // Create the poll object with additional metadata
    const newPoll = {
      id: pollId,
      title: pollData.title,
      description: pollData.description,
      options: pollData.options.map(opt => ({
        ...opt,
        votes: 0,
        sentiments: { positive: 0, neutral: 0, negative: 0 }
      })),
      creator: {
        id: user?.id || 'guest',
        name: user?.name || 'Guest User',
        email: user?.email || 'guest@example.com'
      },
      createdAt: new Date().toISOString(),
      totalVotes: 0,
      active: true,
      voters: [] // Initialize empty voters array
    };

    // Get existing polls from localStorage or initialize empty array
    const existingPolls = JSON.parse(localStorage.getItem('polls') || '[]');
    
    // Add new poll to the array
    const updatedPolls = [newPoll, ...existingPolls];
    
    // Save back to localStorage
    localStorage.setItem('polls', JSON.stringify(updatedPolls));

    // Navigate to the poll view
    navigate('/poll/' + pollId);
  };

  return (
    <Container maxWidth="md">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            my: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {userType === 'guest' && (
            <Alert severity="info" sx={{ mb: 3 }}>
              You are creating this poll as a guest. Sign in to access additional features and track your polls.
            </Alert>
          )}

          <Typography variant="h4" gutterBottom>
            Create Your Poll
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Poll Question"
              variant="outlined"
              value={pollData.title}
              onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Description (Optional)"
              variant="outlined"
              value={pollData.description}
              onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
              margin="normal"
              multiline
              rows={2}
            />

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Poll Options
            </Typography>

            {pollData.options.map((option, index) => (
              <Box
                key={option.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 2,
                  alignItems: 'center'
                }}
              >
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  required
                />
                <IconButton
                  onClick={() => removeOption(option.id)}
                  disabled={pollData.options.length <= 2}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addOption}
              sx={{ mt: 2 }}
            >
              Add Option
            </Button>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 4,
                height: 56,
                background: theme => `linear-gradient(45deg,
                  ${theme.palette.primary.main},
                  ${theme.palette.secondary.main}
                )`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              Create Poll
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreatePoll;