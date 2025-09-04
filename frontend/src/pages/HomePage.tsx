import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteIcon from '@mui/icons-material/Favorite';

const HomePage: React.FC = () => {
  return (
    <Box>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        py: 8, 
        borderRadius: 2,
        mb: 6 
      }}>
        <Container>
          <Typography variant="h2" gutterBottom align="center">
            AI와 함께하는 독서 여정
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 4 }}>
            당신의 독서 감상을 더욱 깊고 풍성하게
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/create-review"
              sx={{ bgcolor: 'white', color: 'primary.main' }}
            >
              감상평 작성하기
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              component={Link} 
              to="/reviews"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              내 감상평 보기
            </Button>
          </Box>
        </Container>
      </Box>

      <Container>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          BookLLM의 특별한 기능
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', textAlign: 'center' }}>
              <PsychologyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI 감정 분석
              </Typography>
              <Typography variant="body1" color="text.secondary">
                독서 후 느낀 감정을 AI가 심층 분석하여 
                당신의 마음을 더 잘 이해할 수 있도록 도와드립니다.
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', textAlign: 'center' }}>
              <FavoriteIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                공감 메시지
              </Typography>
              <Typography variant="body1" color="text.secondary">
                AI가 당신의 감상평을 읽고 따뜻한 공감과 
                깊이 있는 통찰을 제공합니다.
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 300px' }}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', textAlign: 'center' }}>
              <AutoStoriesIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                맞춤 도서 추천
              </Typography>
              <Typography variant="body1" color="text.secondary">
                읽은 책과 감상평을 바탕으로 
                당신에게 꼭 맞는 다음 책을 추천해드립니다.
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ mt: 6, p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom align="center">
            📖 오늘의 독서 명언
          </Typography>
          <Typography variant="body1" align="center" sx={{ fontStyle: 'italic', mt: 2 }}>
            "책은 한 권 한 권이 하나의 세계다" - 윌리엄 워즈워스
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;