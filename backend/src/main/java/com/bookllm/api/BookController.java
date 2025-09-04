package com.bookllm.api;

import com.bookllm.domain.book.dto.CreateBookRequest;
import com.bookllm.domain.book.dto.BookResponse;
import com.bookllm.domain.book.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3001")
public class BookController {
    
    private final BookService bookService;
    
    @PostMapping
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody CreateBookRequest request) {
        BookResponse response = bookService.createBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<BookResponse> findOrCreateBook(
            @RequestParam String title,
            @RequestParam String author,
            @RequestParam(required = false) String genre) {
        BookResponse response = bookService.findOrCreateBook(title, author, genre);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{bookId}")
    public ResponseEntity<BookResponse> getBook(@PathVariable Long bookId) {
        BookResponse book = bookService.getBook(bookId);
        return ResponseEntity.ok(book);
    }
    
    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        List<BookResponse> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }
}