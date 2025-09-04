package com.bookllm.domain.review.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {
    
    @NotNull(message = "책 ID는 필수입니다")
    private Long bookId;
    
    @NotBlank(message = "리뷰 내용은 필수입니다")
    @Size(min = 10, message = "리뷰는 최소 10자 이상 작성해주세요")
    private String content;
    
    @NotNull(message = "평점은 필수입니다")
    @DecimalMin(value = "0.0", message = "평점은 0 이상이어야 합니다")
    @DecimalMax(value = "5.0", message = "평점은 5 이하여야 합니다")
    private Double rating;
    
    @NotBlank(message = "감정 상태는 필수입니다")
    private String userEmotion;
    
    private LocalDateTime readingDate;
    
    // AI 분석 결과 (선택 사항)
    private String aiEmpathyMessage;
    private String aiBookInsights;
    private String aiEmotionAnalysis;
    private String aiBookRecommendations;
    private String aiPersonalizedInsight;
}