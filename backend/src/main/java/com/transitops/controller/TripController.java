package com.transitops.controller;

import com.transitops.dto.TripCompleteRequest;
import com.transitops.dto.TripRequest;
import com.transitops.entity.Trip;
import com.transitops.entity.enums.TripStatus;
import com.transitops.service.TripService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
@Tag(name = "Trips")
public class TripController {

    private final TripService tripService;

    @GetMapping
    public ResponseEntity<List<Trip>> list(
            @RequestParam(required = false) TripStatus status,
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_DRIVER")
                .replace("ROLE_", "");
        return ResponseEntity.ok(tripService.list(status, email, role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> get(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.get(id));
    }

    @PostMapping
    public ResponseEntity<Trip> create(@Valid @RequestBody TripRequest request) {
        return ResponseEntity.ok(tripService.create(request));
    }

    @PutMapping("/{id}/dispatch")
    public ResponseEntity<Trip> dispatch(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.dispatch(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Trip> complete(@PathVariable Long id, @Valid @RequestBody TripCompleteRequest request) {
        return ResponseEntity.ok(tripService.complete(id, request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Trip> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.cancel(id));
    }
}
