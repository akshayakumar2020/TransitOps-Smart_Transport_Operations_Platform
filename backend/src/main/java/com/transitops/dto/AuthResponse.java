package com.transitops.dto;

import com.transitops.entity.enums.Role;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private Role role;
}
