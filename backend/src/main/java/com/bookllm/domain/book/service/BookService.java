package com.bookllm.domain.book.service;

import com.bookllm.domain.book.dto.CreateBookRequest;
import com.bookllm.domain.book.dto.BookResponse;
import com.bookllm.domain.book.entity.Book;
import com.bookllm.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {
    
    private final BookRepository bookRepository;
    
    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .genre(request.getGenre())
                .description(request.getDescription())
                .isbn(request.getIsbn())
                .publisher(request.getPublisher())
                .coverImageUrl(request.getCoverImageUrl())
                .build();
        
        Book savedBook = bookRepository.save(book);
        return BookResponse.from(savedBook);
    }
    
    @Transactional
    public BookResponse findOrCreateBook(String title, String author, String genre) {
        // 먼저 제목과 저자로 책을 찾기
        return bookRepository.findByTitleAndAuthor(title, author)
                .map(BookResponse::from)
                .orElseGet(() -> {
                    // 없으면 새로 생성
                    CreateBookRequest request = new CreateBookRequest();
                    request.setTitle(title);
                    request.setAuthor(author);
                    request.setGenre(genre);
                    return createBook(request);
                });
    }
    
    public BookResponse getBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("책을 찾을 수 없습니다. ID: " + bookId));
        return BookResponse.from(book);
    }
    
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(BookResponse::from)
                .collect(Collectors.toList());
    }
}