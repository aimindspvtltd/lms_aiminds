package com.lms.domain.auth.dto;

import com.lms.domain.user.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
    @NotBlank @Size(min = 2, max = 255)         String name,
    @NotBlank @Email                            String email,
    @NotBlank @Size(min = 8)                    String password,
    @Pattern(regexp = "^\\+?[0-9]{7,15}$")     String phone,
    @NotNull                                    Role role
) {}
