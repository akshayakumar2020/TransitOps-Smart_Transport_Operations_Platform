package com.transitops.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "fuel_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FuelLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    private Double liters;

    private Double cost;

    private LocalDate date;
}
