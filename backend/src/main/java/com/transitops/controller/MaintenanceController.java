package com.transitops.controller;

import com.transitops.dto.MaintenanceRequest;
import com.transitops.entity.MaintenanceLog;
import com.transitops.service.MaintenanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
@Tag(name = "Maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<MaintenanceLog>> list() {
        return ResponseEntity.ok(maintenanceService.list());
    }

    @PostMapping
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    public ResponseEntity<MaintenanceLog> create(@Valid @RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceService.create(request));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('FLEET_MANAGER')")
    public ResponseEntity<MaintenanceLog> close(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.close(id));
    }
}
