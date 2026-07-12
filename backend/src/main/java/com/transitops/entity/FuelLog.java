package com.transitops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "fuel_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuelLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double liters;

    @Column(name = "price_per_liter", nullable = false)
    private Double pricePerLiter;

    @Column(name = "total_cost")
    private Double totalCost;

    @Column(name = "odometer_reading")
    private Double odometerReading;

    @Column(name = "log_date")
    private LocalDate logDate;

    @Column(name = "vehicle_id")
    private Long vehicleId;
}