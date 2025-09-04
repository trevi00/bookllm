package com.bookllm.infrastructure.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiAnalysisResponse {
    
    @JsonProperty("review_id")
    private Long reviewId;
    
    @JsonProperty("ai_response")
    private AiResponse aiResponse;
    
    private List<Recommendation> recommendations;
    
    public String getEmpathyMessage() {
        return aiResponse != null ? aiResponse.getEmpathyMessage() : "";
    }
    
    public String getBookInsights() {
        return aiResponse != null ? String.join(", ", aiResponse.getBookInsights()) : "";
    }
    
    public String getEmotionAnalysis() {
        return aiResponse != null ? aiResponse.getEmotionAnalysis().toString() : "";
    }
    
    public static AiAnalysisResponse empty() {
        return AiAnalysisResponse.builder().build();
    }
    
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiResponse {
        @JsonProperty("empathy_message")
        private String empathyMessage;
        
        @JsonProperty("book_insights")
        private List<String> bookInsights;
        
        @JsonProperty("emotion_analysis")
        private Object emotionAnalysis;
    }
    
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Recommendation {
        private String title;
        private String author;
        private String reason;
        
        @JsonProperty("similarity_score")
        private Double similarityScore;
    }
}