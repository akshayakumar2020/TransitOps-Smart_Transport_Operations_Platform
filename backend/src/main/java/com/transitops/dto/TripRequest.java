package com.transitops.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TripRequest {
    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    @NotNull
    private Long vehicleId;

    @NotNull
    private Long driverId;

    @NotNull @Positive
    private Double cargoWeight;

    private Double plannedDistance;
}
