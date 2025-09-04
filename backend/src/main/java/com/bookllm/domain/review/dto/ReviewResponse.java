package com.bookllm.domain.review.dto;

import com.bookllm.domain.review.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private Long userId;
    private String userNickname;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String content;
    private Double rating;
    private String userEmotion;
    private String aiEmpathyMessage;
    private String aiBookInsights;
    private String aiEmotionAnalysis;
    private String aiBookRecommendations;
    private String aiPersonalizedInsight;
    private LocalDateTime readingDate;
    private LocalDateTime createdAt;
    
    public static ReviewResponse from(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userNickname(review.getUser().getNickname())
                .bookId(review.getBook().getId())
                .bookTitle(review.getBook().getTitle())
                .bookAuthor(review.getBook().getAuthor())
                .content(review.getContent())
                .rating(review.getRating())
                .userEmotion(review.getUserEmotion())
                .aiEmpathyMessage(review.getAiEmpathyMessage())
                .aiBookInsights(review.getAiBookInsights())
                .aiEmotionAnalysis(review.getAiEmotionAnalysis())
                .aiBookRecommendations(review.getAiBookRecommendations())
                .aiPersonalizedInsight(review.getAiPersonalizedInsight())
                .readingDate(review.getReadingDate())
                .createdAt(review.getCreatedAt())
                .build();
    }
}