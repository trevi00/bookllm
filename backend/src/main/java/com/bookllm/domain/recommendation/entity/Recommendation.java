package com.bookllm.domain.recommendation.entity;

import com.bookllm.domain.book.entity.Book;
import com.bookllm.domain.review.entity.Review;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Recommendation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_book_id", nullable = false)
    private Book sourceBook;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review;
    
    @Column(nullable = false)
    private String recommendedTitle;
    
    @Column(nullable = false)
    private String recommendedAuthor;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    private Double similarityScore;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}