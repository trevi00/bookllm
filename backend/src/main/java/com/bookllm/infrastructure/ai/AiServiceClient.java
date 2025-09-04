package com.bookllm.infrastructure.ai;

import com.bookllm.domain.book.entity.Book;
import com.bookllm.domain.review.entity.Review;
import com.bookllm.infrastructure.ai.dto.AiAnalysisRequest;
import com.bookllm.infrastructure.ai.dto.AiAnalysisResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiServiceClient {
    
    private final WebClient.Builder webClientBuilder;
    
    @Value("${ai-service.base-url}")
    private String aiServiceBaseUrl;
    
    public AiAnalysisResponse analyzeReview(Review review, Book book) {
        WebClient webClient = webClientBuilder
                .baseUrl(aiServiceBaseUrl)
                .build();
        
        AiAnalysisRequest request = AiAnalysisRequest.builder()
                .reviewId(review.getId())
                .bookTitle(book.getTitle())
                .author(book.getAuthor())
                .content(review.getContent())
                .rating(review.getRating())
                .userEmotion(review.getUserEmotion())
                .genre(book.getGenre())
                .build();
        
        try {
            return webClient.post()
                    .uri("/api/v1/reviews/analyze")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AiAnalysisResponse.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();
        } catch (Exception e) {
            log.error("AI 서비스 호출 실패: ", e);
            return AiAnalysisResponse.empty();
        }
    }
}