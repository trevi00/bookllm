package com.bookllm.domain.book.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookRequest {
    
    @NotBlank(message = "책 제목은 필수입니다")
    private String title;
    
    @NotBlank(message = "저자는 필수입니다")
    private String author;
    
    private String genre;
    private String description;
    private String isbn;
    private String publisher;
    private String coverImageUrl;
}