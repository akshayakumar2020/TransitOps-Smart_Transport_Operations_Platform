package com.transitops.dto;

import com.transitops.entity.enums.Role;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SignupRequest {
    @NotBlank
    private String name;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull
    private Role role;
}
