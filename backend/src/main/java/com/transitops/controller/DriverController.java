package com.transitops.controller;

import com.transitops.entity.Driver;
import com.transitops.entity.enums.DriverStatus;
import com.transitops.service.DriverService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
@Tag(name = "Drivers")
public class DriverController {

    private final DriverService driverService;

    @GetMapping
    public ResponseEntity<List<Driver>> list(@RequestParam(required = false) DriverStatus status) {
        return ResponseEntity.ok(driverService.list(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> get(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    public ResponseEntity<Driver> register(@Valid @RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.register(driver));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    public ResponseEntity<Driver> update(@PathVariable Long id, @RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.update(id, driver));
    }
}
