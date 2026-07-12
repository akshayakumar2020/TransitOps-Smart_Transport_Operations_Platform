package com.transitops.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "expense")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    private String type;

    private Double amount;

    private LocalDate date;
}
