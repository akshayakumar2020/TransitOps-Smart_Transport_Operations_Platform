package com.transitops.dto;

import com.transitops.entity.User;

/**
 * Public user projection — never exposes the password hash.
 */
public record UserResponse(
    Long id,
    String name,
    String email,
    String role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().getName()
        );
    }
}
