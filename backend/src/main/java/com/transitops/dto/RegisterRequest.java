package com.transitops.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Register request DTO.
 * Only Fleet Managers may invoke the register endpoint.
 */
public record RegisterRequest(
    @NotBlank(message = "Name is required")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password,

    @NotBlank(message = "Role is required")
    @Pattern(
        regexp = "ROLE_FLEET_MANAGER|ROLE_DRIVER|ROLE_SAFETY_OFFICER|ROLE_FINANCIAL_ANALYST",
        message = "Role is invalid"
    )
    String role
) {}
