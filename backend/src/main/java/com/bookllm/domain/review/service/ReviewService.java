package com.bookllm.domain.review.service;

import com.bookllm.domain.book.entity.Book;
import com.bookllm.domain.book.repository.BookRepository;
import com.bookllm.domain.review.dto.CreateReviewRequest;
import com.bookllm.domain.review.dto.ReviewResponse;
import com.bookllm.domain.review.entity.Review;
import com.bookllm.domain.review.repository.ReviewRepository;
import com.bookllm.domain.user.entity.User;
import com.bookllm.domain.user.repository.UserRepository;
import com.bookllm.global.exception.BusinessException;
import com.bookllm.global.exception.ErrorCode;
import com.bookllm.infrastructure.ai.AiServiceClient;
import com.bookllm.infrastructure.ai.dto.AiAnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final AiServiceClient aiServiceClient;
    
    @Transactional
    public ReviewResponse createReview(Long userId, CreateReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new BusinessException(ErrorCode.BOOK_NOT_FOUND));
        
        if (!reviewRepository.findByUserIdAndBookId(userId, request.getBookId()).isEmpty()) {
            throw new BusinessException(ErrorCode.ALREADY_REVIEWED);
        }
        
        Review review = Review.builder()
                .user(user)
                .book(book)
                .content(request.getContent())
                .rating(request.getRating())
                .userEmotion(request.getUserEmotion())
                .readingDate(request.getReadingDate())
                .build();
        
        // 프론트엔드에서 받은 AI 분석 결과가 있으면 바로 저장
        if (request.getAiEmpathyMessage() != null && !request.getAiEmpathyMessage().isEmpty()) {
            if (request.getAiBookRecommendations() != null || request.getAiPersonalizedInsight() != null) {
                review.updateAiAnalysisWithRecommendations(
                        request.getAiEmpathyMessage(),
                        request.getAiBookInsights(),
                        request.getAiEmotionAnalysis(),
                        request.getAiBookRecommendations(),
                        request.getAiPersonalizedInsight()
                );
            } else {
                review.updateAiAnalysis(
                        request.getAiEmpathyMessage(),
                        request.getAiBookInsights(),
                        request.getAiEmotionAnalysis()
                );
            }
        }
        
        Review savedReview = reviewRepository.save(review);
        
        return ReviewResponse.from(savedReview);
    }
    
    public List<ReviewResponse> getUserReviews(Long userId) {
        List<Review> reviews = reviewRepository.findByUserIdWithBookAndUser(userId);
        return reviews.stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }
    
    public List<ReviewResponse> getBookReviews(Long bookId) {
        List<Review> reviews = reviewRepository.findByBookId(bookId);
        return reviews.stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }
    
    public ReviewResponse getReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));
        return ReviewResponse.from(review);
    }
    
    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));
        
        // 본인의 리뷰인지 확인
        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_ACCESS);
        }
        
        reviewRepository.delete(review);
    }
}