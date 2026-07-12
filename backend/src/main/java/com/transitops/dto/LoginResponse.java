package com.transitops.dto;

/**
 * Login response DTO — matches the frontend contract exactly.
 * { success, token, user: { id, name, email, role } }
 */
public record LoginResponse(
    boolean success,
    String token,
    UserResponse user
) {
    public static LoginResponse of(String token, UserResponse user) {
        return new LoginResponse(true, token, user);
    }
}
