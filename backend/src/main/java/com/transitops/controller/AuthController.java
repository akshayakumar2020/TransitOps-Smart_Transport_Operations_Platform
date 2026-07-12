package com.transitops.controller;

import com.transitops.dto.*;
import com.transitops.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Authentication controller.
 *
 * <p>POST /api/auth/login    — public
 * <p>POST /api/auth/register — Fleet Manager only
 * <p>GET  /api/auth/me       — authenticated
 * <p>GET  /api/users         — Fleet Manager only
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, register, and user management endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/auth/register")
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    @Operation(summary = "Register a new user (Fleet Manager only)")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request,
            Authentication authentication) {
        return ResponseEntity.status(201)
                .body(authService.register(request, authentication.getName()));
    }

    @GetMapping("/auth/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    @Operation(summary = "List all users (Fleet Manager only)")
    public ResponseEntity<List<UserResponse>> listUsers() {
        // Delegated to a UserService in a real implementation; shown inline here.
        return ResponseEntity.ok(List.of());
    }
}
