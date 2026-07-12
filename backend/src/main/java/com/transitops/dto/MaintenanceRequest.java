package com.transitops.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MaintenanceRequest {
    @NotNull
    private Long vehicleId;

    @NotBlank
    private String description;

    @NotNull @PositiveOrZero
    private Double cost;
}
