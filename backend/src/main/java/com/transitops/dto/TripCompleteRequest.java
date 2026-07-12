package com.transitops.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TripCompleteRequest {
    @NotNull @Positive
    private Double finalOdometer;

    @NotNull @Positive
    private Double fuelConsumed;
}
