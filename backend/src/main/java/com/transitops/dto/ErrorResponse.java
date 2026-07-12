package com.transitops.dto;

/**
 * Standard error response envelope used by the global exception handler.
 */
public record ErrorResponse(
    boolean success,
    String message
) {
    public static ErrorResponse of(String message) {
        return new ErrorResponse(false, message);
    }
}
