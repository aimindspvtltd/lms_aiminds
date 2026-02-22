package com.lms.domain.auth.dto;

public record LoginResponse(
    String      token,
    UserResponse user
) {}
