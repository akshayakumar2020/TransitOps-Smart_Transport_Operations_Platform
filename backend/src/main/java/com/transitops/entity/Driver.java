package com.transitops.entity;

import com.transitops.entity.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "driver")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String licenseNumber;

    private String licenseCategory;

    private LocalDate licenseExpiryDate;

    private String contactNumber;

    private Double safetyScore;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DriverStatus status = DriverStatus.AVAILABLE;
}
