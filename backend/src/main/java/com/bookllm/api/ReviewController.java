package com.bookllm.api;

import com.bookllm.domain.review.dto.CreateReviewRequest;
import com.bookllm.domain.review.dto.ReviewResponse;
import com.bookllm.domain.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @RequestHeader("userId") Long userId,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse response = reviewService.createReview(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(@PathVariable Long userId) {
        List<ReviewResponse> reviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ReviewResponse>> getBookReviews(@PathVariable Long bookId) {
        List<ReviewResponse> reviews = reviewService.getBookReviews(bookId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> getReview(@PathVariable Long reviewId) {
        ReviewResponse review = reviewService.getReview(reviewId);
        return ResponseEntity.ok(review);
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @RequestHeader("userId") Long userId,
            @PathVariable Long reviewId) {
        reviewService.deleteReview(userId, reviewId);
        return ResponseEntity.noContent().build();
    }
}