package com.bookllm.domain.review.entity;

import com.bookllm.domain.book.entity.Book;
import com.bookllm.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(nullable = false)
    private Double rating;
    
    private String userEmotion;
    
    @Column(columnDefinition = "TEXT")
    private String aiEmpathyMessage;
    
    @Column(columnDefinition = "TEXT")
    private String aiBookInsights;
    
    @Column(columnDefinition = "TEXT")
    private String aiEmotionAnalysis;
    
    @Column(columnDefinition = "TEXT")
    private String aiBookRecommendations;
    
    @Column(columnDefinition = "TEXT")
    private String aiPersonalizedInsight;
    
    private LocalDateTime readingDate;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public void updateAiAnalysis(String empathyMessage, String bookInsights, String emotionAnalysis) {
        this.aiEmpathyMessage = empathyMessage;
        this.aiBookInsights = bookInsights;
        this.aiEmotionAnalysis = emotionAnalysis;
    }
    
    public void updateAiAnalysisWithRecommendations(String empathyMessage, String bookInsights, 
            String emotionAnalysis, String bookRecommendations, String personalizedInsight) {
        this.aiEmpathyMessage = empathyMessage;
        this.aiBookInsights = bookInsights;
        this.aiEmotionAnalysis = emotionAnalysis;
        this.aiBookRecommendations = bookRecommendations;
        this.aiPersonalizedInsight = personalizedInsight;
    }
}