package com.transitops.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FuelLogRequest {
    @NotNull
    private Long vehicleId;

    @NotNull @Positive
    private Double liters;

    @NotNull @PositiveOrZero
    private Double cost;

    @NotNull
    private LocalDate date;
}
