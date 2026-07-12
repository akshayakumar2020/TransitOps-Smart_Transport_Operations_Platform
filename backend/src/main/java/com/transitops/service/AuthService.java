package com.transitops.service;

import com.transitops.dto.LoginRequest;
import com.transitops.dto.LoginResponse;
import com.transitops.dto.RegisterRequest;
import com.transitops.dto.UserResponse;

/**
 * Authentication service — Clean Architecture service layer.
 * Implementations live in {@link com.transitops.service.impl}.
 */
public interface AuthService {

    /** Validate credentials and return a signed JWT + user. */
    LoginResponse login(LoginRequest request);

    /** Register a new user. Only Fleet Managers may call this. */
    UserResponse register(RegisterRequest request, String callerEmail);

    /** Fetch the profile of the currently authenticated user. */
    UserResponse getCurrentUser(String email);
}
