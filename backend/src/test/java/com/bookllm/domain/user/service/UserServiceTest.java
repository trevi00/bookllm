package com.bookllm.domain.user.service;

import com.bookllm.domain.user.dto.SignUpRequest;
import com.bookllm.domain.user.dto.UserResponse;
import com.bookllm.domain.user.entity.User;
import com.bookllm.domain.user.repository.UserRepository;
import com.bookllm.global.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;
    
    private User testUser;
    private SignUpRequest signUpRequest;
    
    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .nickname("테스터")
                .build();
        
        signUpRequest = new SignUpRequest(
                "test@example.com",
                "password123",
                "테스터"
        );
    }
    
    @Test
    @DisplayName("회원가입 성공")
    void signUp_Success() {
        // given
        given(userRepository.existsByEmail(anyString())).willReturn(false);
        given(passwordEncoder.encode(anyString())).willReturn("encodedPassword");
        given(userRepository.save(any(User.class))).willReturn(testUser);
        
        // when
        UserResponse response = userService.signUp(signUpRequest);
        
        // then
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getNickname()).isEqualTo("테스터");
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    @DisplayName("이미 존재하는 이메일로 회원가입 시도 시 실패")
    void signUp_EmailAlreadyExists() {
        // given
        given(userRepository.existsByEmail(anyString())).willReturn(true);
        
        // when & then
        assertThatThrownBy(() -> userService.signUp(signUpRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("이미 존재하는 이메일");
    }
    
    @Test
    @DisplayName("ID로 사용자 조회 성공")
    void getUserById_Success() {
        // given
        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));
        
        // when
        UserResponse response = userService.getUserById(1L);
        
        // then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("test@example.com");
    }
    
    @Test
    @DisplayName("존재하지 않는 ID로 사용자 조회 시 실패")
    void getUserById_NotFound() {
        // given
        given(userRepository.findById(999L)).willReturn(Optional.empty());
        
        // when & then
        assertThatThrownBy(() -> userService.getUserById(999L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("사용자를 찾을 수 없습니다");
    }
}