package com.transitops.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ExpenseRequest {
    @NotNull
    private Long vehicleId;

    @NotBlank
    private String type;

    @NotNull @PositiveOrZero
    private Double amount;

    @NotNull
    private LocalDate date;
}
