import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Typography, Button, Container, Grid, Box } from '@mui/material';
import PollIcon from '@mui/icons-material/Poll';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShareIcon from '@mui/icons-material/Share';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const HeroSection = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const GradientText = styled.span`
  background: linear-gradient(45deg,
    ${props => props.theme.palette.primary.main},
    ${props => props.theme.palette.secondary.main}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.theme.palette.primary.main}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  
  svg {
    font-size: 32px;
    color: ${props => props.theme.palette.primary.main};
  }
`;

const features = [
  {
    icon: <PollIcon />,
    title: 'Quick Polls',
    description: 'Create beautiful polls in seconds with our intuitive interface'
  },
  {
    icon: <TimelineIcon />,
    title: 'Real-time Results',
    description: 'Watch responses flow in instantly with live updates'
  },
  {
    icon: <ShareIcon />,
    title: 'Easy Sharing',
    description: 'Share your polls instantly via QR codes or links'
  },
  {
    icon: <SentimentSatisfiedAltIcon />,
    title: 'Sentiment Analysis',
    description: 'Capture emotional responses with our unique sentiment feature'
  }
];

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <Container>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Make Your Voice Heard
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Create engaging polls with real-time results and emotional insights.
              Get started in seconds, no account required.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/create')}
              sx={{
                mt: 4,
                py: 2,
                px: 4,
                borderRadius: '30px',
                background: theme => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              Create Your Poll
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <FeatureCard>
                  <IconWrapper>
                    {feature.icon}
                  </IconWrapper>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );
};

export default Home;