package com.transitops.config;

import com.transitops.entity.Role;
import com.transitops.entity.User;
import com.transitops.repository.RoleRepository;
import com.transitops.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds roles and demo users on startup when the `dev` profile is active.
 *
 * Password for all demo users: Password@123
 *
 * Activate with: --spring.profiles.active=dev
 */
@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("🌱  Seeding TransitOps database…");

        List<String> roleNames = List.of(
            "ROLE_FLEET_MANAGER",
            "ROLE_DRIVER",
            "ROLE_SAFETY_OFFICER",
            "ROLE_FINANCIAL_ANALYST"
        );

        for (String name : roleNames) {
            roleRepository.findByName(name)
                    .orElseGet(() -> roleRepository.save(
                        Role.builder().name(name).build()));
        }

        record Seed(String name, String email, String role) {}
        List<Seed> seeds = List.of(
            new Seed("Fleet Manager",     "manager@transitops.com", "ROLE_FLEET_MANAGER"),
            new Seed("Driver",            "driver@transitops.com",  "ROLE_DRIVER"),
            new Seed("Safety Officer",     "safety@transitops.com",  "ROLE_SAFETY_OFFICER"),
            new Seed("Financial Analyst",  "finance@transitops.com", "ROLE_FINANCIAL_ANALYST")
        );

        String passwordHash = passwordEncoder.encode("Password@123");

        for (Seed seed : seeds) {
            Role role = roleRepository.findByName(seed.role()).orElseThrow();
            if (!userRepository.existsByEmail(seed.email())) {
                userRepository.save(User.builder()
                    .name(seed.name())
                    .email(seed.email())
                    .password(passwordHash)
                    .role(role)
                    .active(true)
                    .build());
                log.info("  + user: {} ({})", seed.email(), seed.role());
            }
        }

        log.info("✅  Seed complete.");
    }
}
