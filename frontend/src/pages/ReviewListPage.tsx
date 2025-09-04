import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Rating,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Review {
  id: number;
  bookTitle: string;
  bookAuthor: string;
  content: string;
  rating: number;
  userEmotion: string;
  createdAt: string;
  aiEmpathyMessage?: string;
  aiBookInsights?: string;
  aiEmotionAnalysis?: string;
  aiBookRecommendations?: string;
  aiPersonalizedInsight?: string;
}

const ReviewListPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // 임시로 userId 1 사용
      const response = await axios.get('http://localhost:8080/api/reviews/user/1');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // 테스트용 더미 데이터
      setReviews([
        {
          id: 1,
          bookTitle: '어린 왕자',
          bookAuthor: '생텍쥐페리',
          content: '순수함과 사랑에 대한 아름다운 이야기였습니다.',
          rating: 5,
          userEmotion: '감동적',
          createdAt: new Date().toISOString(),
          aiEmpathyMessage: '어린 왕자의 순수한 시선을 통해 세상을 바라보셨군요.',
          aiBookInsights: '순수함의 가치, 사랑의 의미, 어른의 세계에 대한 비판',
          aiEmotionAnalysis: '{"primary": "감동", "secondary": "그리움"}',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('정말로 이 감상평을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
        headers: {
          'userId': '1' // 임시로 userId 1 사용
        }
      });
      
      // 삭제 성공 시 목록 새로고침
      fetchReviews();
      alert('감상평이 삭제되었습니다.');
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
    // 쉼표로 구분된 문자열을 배열로 변환
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        📚 내 독서 감상평
      </Typography>

      {reviews.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" color="text.secondary">
              아직 작성한 감상평이 없습니다.
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                component={Link}
                to="/create-review"
              >
                첫 감상평 작성하기
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {reviews.map((review) => {
            const bookInsights = parseBookInsights(review.aiBookInsights);
            const emotionAnalysis = parseEmotionAnalysis(review.aiEmotionAnalysis);
            
            return (
              <Box key={review.id} sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {review.bookTitle}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {review.bookAuthor}
                    </Typography>
                    
                    <Box sx={{ my: 2 }}>
                      <Rating value={review.rating} readOnly />
                      <Chip 
                        label={review.userEmotion} 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {review.content.length > 150
                        ? `${review.content.substring(0, 150)}...`
                        : review.content}
                    </Typography>
                    
                    {review.aiEmpathyMessage && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="primary" fontWeight="bold">
                            💭 AI 공감 메시지
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {review.aiEmpathyMessage}
                          </Typography>
                        </Box>
                      </>
                    )}
                    
                    {bookInsights.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="primary" fontWeight="bold">
                          📖 책에 대한 통찰
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {bookInsights.map((insight, index) => (
                            <Typography key={index} variant="body2" sx={{ ml: 1 }}>
                              • {insight}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {emotionAnalysis && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="primary" fontWeight="bold">
                          🎭 감정 분석
                        </Typography>
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                          {emotionAnalysis.primary && (
                            <Chip 
                              label={`주요: ${emotionAnalysis.primary}`}
                              size="small" 
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                          {emotionAnalysis.secondary && (
                            <Chip 
                              label={`보조: ${emotionAnalysis.secondary}`}
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(review.createdAt)}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/review/${review.id}`}
                    >
                      자세히 보기
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      삭제
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ReviewListPage;