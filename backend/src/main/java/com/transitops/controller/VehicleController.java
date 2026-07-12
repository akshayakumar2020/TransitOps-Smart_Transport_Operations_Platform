package com.transitops.controller;

import com.transitops.entity.Vehicle;
import com.transitops.entity.enums.VehicleStatus;
import com.transitops.service.VehicleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<Vehicle>> list(
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(vehicleService.list(status, type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> get(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    public ResponseEntity<Vehicle> register(@Valid @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.register(vehicle));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    public ResponseEntity<Vehicle> update(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.update(id, vehicle));
    }
}
