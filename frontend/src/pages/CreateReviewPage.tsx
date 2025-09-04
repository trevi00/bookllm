import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface BookData {
  id?: number;
  title: string;
  author: string;
  genre: string;
}

interface ReviewData {
  bookId?: number;
  bookTitle: string;
  author: string;
  genre: string;
  content: string;
  rating: number;
  userEmotion: string;
}

const CreateReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [bookId, setBookId] = useState<number | null>(null);
  const [error, setError] = useState('');
  
  const [reviewData, setReviewData] = useState<ReviewData>({
    bookTitle: '',
    author: '',
    genre: '',
    content: '',
    rating: 5,
    userEmotion: '',
  });

  const emotions = [
    '감동적',
    '즐거움',
    '슬픔',
    '놀라움',
    '평온함',
    '흥미로움',
    '아쉬움',
    '따뜻함',
  ];

  const genres = [
    '소설',
    '에세이',
    '자기계발',
    '경제/경영',
    '인문학',
    '과학',
    '역사',
    '예술',
    '동화',
    '기타',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. 먼저 책을 조회하거나 생성
      const bookResponse = await axios.get('http://localhost:8080/api/books/search', {
        params: {
          title: reviewData.bookTitle,
          author: reviewData.author,
          genre: reviewData.genre
        }
      });
      const fetchedBookId = bookResponse.data.id;
      setBookId(fetchedBookId);

      // 2. AI 서비스에 분석 요청
      const aiServiceResponse = await axios.post('http://localhost:8001/api/v1/reviews/analyze', {
        book_title: reviewData.bookTitle,
        author: reviewData.author,
        content: reviewData.content,
        rating: reviewData.rating,
        user_emotion: reviewData.userEmotion,
        genre: reviewData.genre,
      });

      console.log('AI Response:', aiServiceResponse.data); // 디버깅용
      setAiResponse(aiServiceResponse.data);
      setError(''); // AI 분석 성공 시 에러 초기화
      
    } catch (err: any) {
      console.error('Error:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        setError(`AI 분석 중 오류가 발생했습니다: ${err.response.data.message || err.response.data}`);
      } else {
        setError('AI 분석 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = async () => {
    setSaving(true);
    setError('');

    try {
      if (!bookId) {
        throw new Error('책 정보가 없습니다.');
      }

      // 백엔드에 리뷰 저장 (AI 분석 결과 포함)
      const reviewPayload = {
        bookId: bookId,
        content: reviewData.content,
        rating: parseFloat(reviewData.rating.toString()), // Double로 변환
        userEmotion: reviewData.userEmotion,
        readingDate: new Date().toISOString().slice(0, -1), // LocalDateTime 형식으로 변환 (Z 제거)
        aiEmpathyMessage: aiResponse?.ai_response?.empathy_message || '',
        aiBookInsights: aiResponse?.ai_response?.book_insights?.join(', ') || '',
        aiEmotionAnalysis: JSON.stringify(aiResponse?.ai_response?.emotion_analysis || {}),
        aiBookRecommendations: JSON.stringify(aiResponse?.ai_response?.book_recommendations || []),
        aiPersonalizedInsight: aiResponse?.ai_response?.personalized_insight || ''
      };

      await axios.post('http://localhost:8080/api/reviews', reviewPayload, {
        headers: {
          'userId': '1' // 임시로 userId 1 사용
        }
      });
      
      // 성공 알림을 추가하거나 리스트 페이지로 이동
      alert('감상평이 성공적으로 등록되었습니다!');
      navigate('/reviews');
      
    } catch (err: any) {
      console.error('Error:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        setError(`리뷰 등록 중 오류가 발생했습니다: ${err.response.data.message || err.response.data}`);
      } else {
        setError('리뷰 등록 중 오류가 발생했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ReviewData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setReviewData({
      ...reviewData,
      [field]: e.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        📝 독서 감상평 작성
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: '300px' }}>
                <TextField
                  fullWidth
                  label="책 제목"
                  value={reviewData.bookTitle}
                  onChange={handleChange('bookTitle')}
                  required
                />
              </Box>
              
              <Box sx={{ flex: 1, minWidth: '300px' }}>
                <TextField
                  fullWidth
                  label="저자"
                  value={reviewData.author}
                  onChange={handleChange('author')}
                  required
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: '300px' }}>
                <FormControl fullWidth>
                  <InputLabel>장르</InputLabel>
                  <Select
                    value={reviewData.genre}
                    label="장르"
                    onChange={handleChange('genre')}
                    required
                  >
                    {genres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        {genre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ flex: 1, minWidth: '300px' }}>
                <FormControl fullWidth>
                  <InputLabel>읽고 난 후 감정</InputLabel>
                  <Select
                    value={reviewData.userEmotion}
                    label="읽고 난 후 감정"
                    onChange={handleChange('userEmotion')}
                    required
                  >
                    {emotions.map((emotion) => (
                      <MenuItem key={emotion} value={emotion}>
                        {emotion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box>
              <Typography component="legend">평점</Typography>
              <Rating
                value={reviewData.rating}
                onChange={(event, newValue) => {
                  setReviewData({ ...reviewData, rating: newValue || 5 });
                }}
                size="large"
              />
            </Box>
            
            <Box>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="감상평"
                value={reviewData.content}
                onChange={handleChange('content')}
                placeholder="책을 읽고 느낀 점을 자유롭게 작성해주세요..."
                required
              />
            </Box>
            
            <Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'AI 분석 받기'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {aiResponse && (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                🤖 AI 분석 결과
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  💬 공감 메시지
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {aiResponse.ai_response?.empathy_message}
                </Typography>
              </Box>
              
              {aiResponse.ai_response?.book_insights && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    📚 책에 대한 통찰
                  </Typography>
                  {aiResponse.ai_response.book_insights.map((insight: string, index: number) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      • {insight}
                    </Typography>
                  ))}
                </Box>
              )}
              
              {aiResponse.ai_response?.book_recommendations && aiResponse.ai_response.book_recommendations.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    📖 추천 도서
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                    {aiResponse.ai_response.book_recommendations.map((book: any, index: number) => (
                      <Paper key={index} sx={{ p: 2, bgcolor: '#f8f9fa', borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
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
                </Box>
              )}
              
              {aiResponse.ai_response?.personalized_insight && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'secondary.50', borderRadius: 2, border: '1px solid', borderColor: 'secondary.200' }}>
                  <Typography variant="h6" gutterBottom color="secondary.dark">
                    ✨ 당신만을 위한 메시지
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                    {aiResponse.ai_response.personalized_insight}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSaveReview}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : null}
                >
                  {saving ? '등록 중...' : '📚 리뷰 등록하기'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    setAiResponse(null);
                    setBookId(null);
                  }}
                >
                  다시 분석하기
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default CreateReviewPage;