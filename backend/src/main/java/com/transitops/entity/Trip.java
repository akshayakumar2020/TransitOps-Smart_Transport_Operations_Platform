package com.transitops.entity;

import com.transitops.entity.enums.TripStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trip")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;

    private String destination;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    private Double cargoWeight;

    private Double plannedDistance;

    private Double finalOdometer;

    private Double fuelConsumed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TripStatus status = TripStatus.DRAFT;
}
