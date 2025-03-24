import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeSVG } from 'qrcode.react';
import BalloonChart from '../components/BalloonChart';

const ViewPoll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Load polls from localStorage
    const polls = JSON.parse(localStorage.getItem('polls') || '[]');
    const foundPoll = polls.find(p => p.id === id);
    
    if (foundPoll) {
      setPoll(foundPoll);
      // Check if current user has already voted
      const voterIdentifier = user?.email || user?.id || window.localStorage.getItem('guestId');
      setHasVoted(foundPoll.voters?.includes(voterIdentifier));
    } else {
      setError('Poll not found');
    }
  }, [id, user]);

  const handleVote = (e) => {
    e.preventDefault();
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    // Get current polls
    const polls = JSON.parse(localStorage.getItem('polls') || '[]');
    const pollIndex = polls.findIndex(p => p.id === id);

    if (pollIndex === -1) {
      setError('Poll not found');
      return;
    }

    // Get or create voter identifier
    let voterIdentifier = user?.email || user?.id;
    if (!voterIdentifier) {
      // For guest users, create a persistent guest ID if not exists
      voterIdentifier = window.localStorage.getItem('guestId');
      if (!voterIdentifier) {
        voterIdentifier = 'guest_' + Date.now();
        window.localStorage.setItem('guestId', voterIdentifier);
      }
    }

    // Check if user has already voted
    if (polls[pollIndex].voters?.includes(voterIdentifier)) {
      setError('You have already voted in this poll');
      return;
    }

    // Update the poll
    const updatedPoll = { ...polls[pollIndex] };
    updatedPoll.options = updatedPoll.options.map(opt => ({
      ...opt,
      votes: opt.id === selectedOption ? (opt.votes || 0) + 1 : (opt.votes || 0)
    }));
    updatedPoll.totalVotes = (updatedPoll.totalVotes || 0) + 1;
    
    // Add voter to the list
    updatedPoll.voters = [...(updatedPoll.voters || []), voterIdentifier];

    // Save back to localStorage
    polls[pollIndex] = updatedPoll;
    localStorage.setItem('polls', JSON.stringify(polls));

    // Update state
    setPoll(updatedPoll);
    setHasVoted(true);
    setSuccess(true);
    setError('');

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  if (error === 'Poll not found') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="error">
            Poll not found. It may have been deleted or never existed.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 3 }}
          >
            Return Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (!poll) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  const totalVotes = poll.totalVotes || 0;

  return (
    <Container maxWidth="md">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ my: 4 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {poll.title}
                </Typography>
                {poll.description && (
                  <Typography color="textSecondary" paragraph>
                    {poll.description}
                  </Typography>
                )}
              </Box>
              <IconButton 
                onClick={() => setShowQR(true)}
                sx={{
                  ml: 2,
                  background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                  '&:hover': {
                    background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}30, ${theme.palette.secondary.main}30)`,
                  }
                }}
              >
                <ShareIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label={`${totalVotes} votes`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={poll.active ? 'Active' : 'Closed'}
                color={poll.active ? 'success' : 'default'}
                variant="outlined"
              />
              <Typography variant="body2" color="textSecondary">
                Created by {poll.creator.name}
              </Typography>
            </Box>
          </Box>

          {hasVoted && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom align="center">
                Poll Results
              </Typography>
              <BalloonChart options={poll.options} totalVotes={totalVotes} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Vote recorded successfully!
            </Alert>
          )}

          {hasVoted && (
            <Alert severity="info" sx={{ mb: 3 }}>
              You have already voted in this poll. You can view the results below.
            </Alert>
          )}

          <form onSubmit={handleVote}>
            <RadioGroup
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {poll.options.map((option, index) => (
                <React.Fragment key={option.id}>
                  {index > 0 && <Divider sx={{ my: 2 }} />}
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      value={option.id}
                      control={<Radio />}
                      label={option.text}
                      disabled={hasVoted}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={totalVotes ? (option.votes / totalVotes) * 100 : 0}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                      {option.votes || 0} votes ({totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0}%)
                    </Typography>
                  </Box>
                </React.Fragment>
              ))}
            </RadioGroup>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={hasVoted}
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
              {hasVoted ? 'Already Voted' : 'Vote'}
            </Button>
          </form>
        </Paper>
      </Box>

      <Dialog
        open={showQR}
        onClose={() => setShowQR(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Share Poll</Typography>
            <IconButton
              onClick={() => setShowQR(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <QRCodeSVG
              value={window.location.href}
              size={200}
              level="H"
              includeMargin
              style={{
                padding: '16px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
              Scan this QR code to share the poll
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowQR(false);
              }}
              sx={{ mt: 2 }}
            >
              Copy Link
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ViewPoll;