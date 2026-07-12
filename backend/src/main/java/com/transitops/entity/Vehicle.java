package com.transitops.entity;

import com.transitops.entity.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicle")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    private String nameModel;

    private String type;

    private Double maxLoadCapacity;

    private Double odometer;

    private Double acquisitionCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VehicleStatus status = VehicleStatus.AVAILABLE;
}
