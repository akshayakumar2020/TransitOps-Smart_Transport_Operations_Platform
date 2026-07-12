package com.transitops.service.impl;

import com.transitops.dto.*;
import com.transitops.entity.Role;
import com.transitops.entity.User;
import com.transitops.repository.RoleRepository;
import com.transitops.repository.UserRepository;
import com.transitops.security.JwtService;
import com.transitops.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * AuthService implementation.
 *
 * Constructor-injected dependencies (no field injection).
 * Uses {@link PasswordEncoder} (BCrypt) for hashing and {@link JwtService}
 * for token issuance.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid Email or Password"));

        if (!user.getActive()) {
            throw new BadCredentialsException("Invalid Email or Password");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid Email or Password");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName()
        );

        return LoginResponse.of(token, UserResponse.from(user));
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request, String callerEmail) {
        // Caller role is enforced at the controller / Security layer.
        if (userRepository.existsByEmail(request.email().toLowerCase())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        Role role = roleRepository.findByName(request.role())
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + request.role()));

        User user = User.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .active(true)
                .build();

        user = userRepository.save(user);
        log.info("New user registered by {}: {}", callerEmail, user.getEmail());

        return UserResponse.from(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.from(user);
    }

    // ─── Domain exceptions (caught by GlobalExceptionHandler) ───

    public static class BadCredentialsException extends RuntimeException {
        public BadCredentialsException(String message) { super(message); }
    }

    public static class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String message) { super(message); }
    }

    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) { super(message); }
    }
}
