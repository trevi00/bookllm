import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Rating,
  Chip,
  CircularProgress,
  Divider,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Review {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  content: string;
  rating: number;
  userEmotion: string;
  createdAt: string;
  readingDate?: string;
  aiEmpathyMessage?: string;
  aiBookInsights?: string;
  aiEmotionAnalysis?: string;
  aiBookRecommendations?: string;
  aiPersonalizedInsight?: string;
}

const ReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/reviews/${id}`);
      setReview(response.data);
    } catch (error) {
      console.error('Error fetching review:', error);
      alert('리뷰를 불러올 수 없습니다.');
      navigate('/reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('정말로 이 감상평을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${id}`, {
        headers: {
          'userId': '1' // 임시로 userId 1 사용
        }
      });
      
      alert('감상평이 삭제되었습니다.');
      navigate('/reviews');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('감상평 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const parseBookInsights = (insights?: string): string[] => {
    if (!insights) return [];
    return insights.split(',').map(insight => insight.trim()).filter(Boolean);
  };

  const parseEmotionAnalysis = (analysis?: string): any => {
    if (!analysis) return null;
    try {
      return JSON.parse(analysis);
    } catch {
      return null;
    }
  };

  const parseBookRecommendations = (recommendations?: string): any[] => {
    if (!recommendations) return [];
    try {
      return JSON.parse(recommendations);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!review) {
    return (
      <Box>
        <Typography variant="h5">리뷰를 찾을 수 없습니다.</Typography>
        <Button component={Link} to="/reviews" startIcon={<ArrowBackIcon />}>
          목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  const bookInsights = parseBookInsights(review.aiBookInsights);
  const emotionAnalysis = parseEmotionAnalysis(review.aiEmotionAnalysis);
  const bookRecommendations = parseBookRecommendations(review.aiBookRecommendations);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          component={Link} 
          to="/reviews" 
          startIcon={<ArrowBackIcon />}
        >
          목록으로 돌아가기
        </Button>
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteReview}
        >
          삭제
        </Button>
      </Box>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {review.bookTitle}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {review.bookAuthor}
          </Typography>

          <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Rating value={review.rating} readOnly size="large" />
            <Chip 
              label={review.userEmotion} 
              color="primary" 
            />
            <Typography variant="body2" color="text.secondary">
              {formatDate(review.createdAt)}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            📝 나의 감상평
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              {review.content}
            </Typography>
          </Paper>

          {review.aiEmpathyMessage && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                💭 AI 공감 메시지
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'primary.50', mb: 3 }}>
                <Typography variant="body1">
                  {review.aiEmpathyMessage}
                </Typography>
              </Paper>
            </>
          )}

          {bookInsights.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                📖 책에 대한 통찰
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
                {bookInsights.map((insight, index) => (
                  <Box key={index} sx={{ mb: 1.5 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ marginRight: '8px', color: '#1976d2' }}>•</span>
                      {insight}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </>
          )}

          {emotionAnalysis && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                🎭 감정 분석
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {emotionAnalysis.primary && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        주요 감정
                      </Typography>
                      <Chip 
                        label={emotionAnalysis.primary}
                        color="secondary"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                  {emotionAnalysis.secondary && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        보조 감정
                      </Typography>
                      <Chip 
                        label={emotionAnalysis.secondary}
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                  {emotionAnalysis.intensity && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        감정 강도
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {emotionAnalysis.intensity}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </>
          )}

          {bookRecommendations.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                📚 추천 도서
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, mb: 3 }}>
                {bookRecommendations.map((book: any, index: number) => (
                  <Paper key={index} sx={{ p: 2, bgcolor: 'primary.50' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {book.author} 저
                    </Typography>
                    <Typography variant="body2">
                      {book.reason}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </>
          )}

          {review.aiPersonalizedInsight && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                ✨ 개인화된 통찰
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'secondary.50' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  {review.aiPersonalizedInsight}
                </Typography>
              </Paper>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReviewDetailPage;