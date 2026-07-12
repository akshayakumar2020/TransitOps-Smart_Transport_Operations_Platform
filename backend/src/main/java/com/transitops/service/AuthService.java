package com.transitops.service;

import com.transitops.dto.*;
import com.transitops.entity.User;
import com.transitops.repository.UserRepository;
import com.transitops.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import com.transitops.exception.ApiException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final com.transitops.repository.DriverRepository driverRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT);
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);

        // If user signs up as a driver, automatically create a linked Driver profile for them
        if (request.getRole() == com.transitops.entity.enums.Role.DRIVER) {
            com.transitops.entity.Driver driver = com.transitops.entity.Driver.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .licenseNumber("TEMP-" + System.currentTimeMillis())
                    .licenseCategory("Class A")
                    .licenseExpiryDate(java.time.LocalDate.now().plusYears(3))
                    .contactNumber("N/A")
                    .safetyScore(100.0)
                    .status(com.transitops.entity.enums.DriverStatus.AVAILABLE)
                    .build();
            driverRepository.save(driver);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
