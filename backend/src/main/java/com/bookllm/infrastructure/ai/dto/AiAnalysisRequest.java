package com.bookllm.infrastructure.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiAnalysisRequest {
    
    @JsonProperty("review_id")
    private Long reviewId;
    
    @JsonProperty("book_title")
    private String bookTitle;
    
    private String author;
    
    private String content;
    
    private Double rating;
    
    @JsonProperty("user_emotion")
    private String userEmotion;
    
    private String genre;
}