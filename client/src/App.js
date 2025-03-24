import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePoll from './pages/CreatePoll';
import ViewPoll from './pages/ViewPoll';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';

const DashboardRoute = ({ children }) => {
  const { user, userType } = useAuth();
  if (!user || userType === 'guest') {
    return <Navigate to="/login" />;
  }
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, userType } = useAuth();
  if (user && userType !== 'guest') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box sx={{ pt: 8 }}>
        <Routes>
          <Route path="/login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:id" element={<ViewPoll />} />
          <Route path="/profile" element={
            <DashboardRoute>
              <Profile />
            </DashboardRoute>
          } />
          <Route path="/dashboard" element={
            <DashboardRoute>
              <Dashboard />
            </DashboardRoute>
          } />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;