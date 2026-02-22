package com.lms.domain.auth;

import com.lms.common.exception.ConflictException;
import com.lms.common.exception.ForbiddenException;
import com.lms.common.exception.NotFoundException;
import com.lms.common.exception.UnauthorizedException;
import com.lms.domain.auth.dto.LoginRequest;
import com.lms.domain.auth.dto.LoginResponse;
import com.lms.domain.auth.dto.RegisterRequest;
import com.lms.domain.auth.dto.UserResponse;
import com.lms.domain.user.User;
import com.lms.domain.user.UserRepository;
import com.lms.domain.user.UserStatus;
import com.lms.security.JwtUtil;
import com.lms.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository       userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil              jwtUtil;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndDeletedAtIsNull(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ForbiddenException("Account is not active");
        }

        userRepository.updateLastLoginAt(user.getId(), LocalDateTime.now());

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return new LoginResponse(token, UserResponse.from(user));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailAndDeletedAtIsNull(request.email())) {
            throw new ConflictException("Email already in use");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .role(request.role())
                .status(UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse me() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        return UserResponse.from(user);
    }
}
