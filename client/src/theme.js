import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF',
      light: '#8B85FF',
      dark: '#4B45B3',
    },
    secondary: {
      main: '#FF6584',
      light: '#FF89A1',
      dark: '#B34659',
    },
    background: {
      default: '#F8F9FE',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

export default theme; 