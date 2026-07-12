package com.transitops.entity;

import com.transitops.entity.enums.MaintenanceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "maintenance_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    private String description;

    private Double cost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MaintenanceStatus status = MaintenanceStatus.OPEN;

    private LocalDate createdDate;

    private LocalDate closedDate;
}
