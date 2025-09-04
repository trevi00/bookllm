import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, AppBar, Toolbar, Typography, Button, CssBaseline, Box } from '@mui/material';
import axios from 'axios';
import HomePage from './pages/HomePage';
import ReviewListPage from './pages/ReviewListPage';
import CreateReviewPage from './pages/CreateReviewPage';
import ReviewDetailPage from './pages/ReviewDetailPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF6B6B',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
});

function App() {
  useEffect(() => {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        console.log('Request:', config.method?.toUpperCase(), config.url);
        console.log('Request Data:', config.data);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => {
        console.log('Response:', response.status, response.config.url);
        console.log('Response Data:', response.data);
        return response;
      },
      (error) => {
        console.error('Response Error:', error.response?.status, error.config?.url);
        console.error('Error Data:', error.response?.data);
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
              📚 BookLLM - AI 독서 감상평
            </Typography>
            <Button color="inherit" component={Link} to="/reviews">
              내 감상평
            </Button>
            <Button color="inherit" component={Link} to="/create-review">
              감상평 작성
            </Button>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reviews" element={<ReviewListPage />} />
            <Route path="/create-review" element={<CreateReviewPage />} />
            <Route path="/review/:id" element={<ReviewDetailPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;