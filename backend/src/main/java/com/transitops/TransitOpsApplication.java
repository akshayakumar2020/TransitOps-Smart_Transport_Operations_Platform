package com.transitops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * TransitOps backend entry point.
 *
 * Bootstraps Spring Boot, Spring Security, JPA and SpringDoc OpenAPI.
 */
@SpringBootApplication
public class TransitOpsApplication {

    public static void main(String[] args) {
        SpringApplication.run(TransitOpsApplication.class, args);
    }
}
