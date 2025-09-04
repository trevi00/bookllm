package com.bookllm.domain.review.repository;

import com.bookllm.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserId(Long userId);
    
    List<Review> findByBookId(Long bookId);
    
    @Query("SELECT r FROM Review r WHERE r.user.id = :userId AND r.book.id = :bookId")
    List<Review> findByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") Long bookId);
    
    @Query("SELECT r FROM Review r JOIN FETCH r.book JOIN FETCH r.user WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<Review> findByUserIdWithBookAndUser(@Param("userId") Long userId);
}