package com.bookllm.domain.recommendation.repository;

import com.bookllm.domain.recommendation.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findBySourceBookId(Long sourceBookId);
    
    List<Recommendation> findByReviewId(Long reviewId);
}