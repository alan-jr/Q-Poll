import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Button
} from '@mui/material';
import {
  Poll as PollIcon,
  HowToVote as VoteIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  
  useEffect(() => {
    // Load polls from localStorage
    const storedPolls = JSON.parse(localStorage.getItem('polls') || '[]');
    setPolls(storedPolls);
  }, []);

  // Filter polls based on user
  const createdPolls = polls.filter(poll => poll.creator.email === user?.email);
  const participatedPolls = polls.filter(poll => {
    // Add logic here when you implement voting to track participated polls
    return false;
  });

  // Calculate poll statistics
  const pollStats = {
    totalCreated: createdPolls.length,
    totalVotes: createdPolls.reduce((sum, poll) => sum + (poll.totalVotes || 0), 0),
    activePolls: createdPolls.filter(poll => poll.active).length,
    totalParticipated: participatedPolls.length
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card
      component={motion.div}
      whileHover={{ y: -5 }}
      sx={{
        height: '100%',
        background: `linear-gradient(45deg, ${color}20, ${color}10)`,
        border: `1px solid ${color}30`
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color: color, mr: 1 }} />
          <Typography color="textSecondary" variant="h6">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (userType === 'guest') {
    return (
      <Container maxWidth="sm">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ mt: 8, textAlign: 'center' }}
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
            <Typography variant="h4" gutterBottom>
              Guest User
            </Typography>
            <Typography color="textSecondary" paragraph>
              Sign in to access your dashboard and manage your polls
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{
                mt: 3,
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
              Sign In
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: '2rem',
                  background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                }}
              >
                {user?.name?.[0]?.toUpperCase() || '?'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4">{user?.name}</Typography>
              <Typography color="textSecondary">{user?.email}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Member since {new Date(user?.joinedDate).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={PollIcon}
              title="Polls Created"
              value={pollStats.totalCreated}
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={VoteIcon}
              title="Total Votes"
              value={pollStats.totalVotes}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={TimelineIcon}
              title="Active Polls"
              value={pollStats.activePolls}
              color="#ff9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={PersonIcon}
              title="Polls Answered"
              value={pollStats.totalParticipated}
              color="#9c27b0"
            />
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Created Polls" />
            <Tab label="Participated Polls" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <List>
              {createdPolls.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No polls created yet"
                    secondary="Create your first poll to see it here"
                  />
                </ListItem>
              ) : (
                createdPolls.map((poll, index) => (
                  <React.Fragment key={poll.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{ py: 2 }}
                      button
                      onClick={() => navigate(`/poll/${poll.id}`)}
                      secondaryAction={
                        <Chip
                          label={poll.active ? 'Active' : 'Closed'}
                          color={poll.active ? 'success' : 'default'}
                          size="small"
                        />
                      }
                    >
                      <ListItemText
                        primary={poll.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {poll.totalVotes} votes • Created on {new Date(poll.createdAt).toLocaleDateString()}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={pollStats.totalVotes ? (poll.totalVotes / pollStats.totalVotes) * 100 : 0}
                              sx={{ mt: 1, height: 4, borderRadius: 2 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              )}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <List>
              {participatedPolls.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No polls participated in yet"
                    secondary="Vote in polls to see them here"
                  />
                </ListItem>
              ) : (
                participatedPolls.map((poll, index) => (
                  <React.Fragment key={poll.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{ py: 2 }}
                      button
                      onClick={() => navigate(`/poll/${poll.id}`)}
                    >
                      <ListItemText
                        primary={poll.title}
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            Voted on {new Date(poll.createdAt).toLocaleDateString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              )}
            </List>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 