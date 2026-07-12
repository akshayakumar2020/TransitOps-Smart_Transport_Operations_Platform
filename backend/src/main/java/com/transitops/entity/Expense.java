package com.transitops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "expense")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false) // e.g., TOLL, MAINTENANCE, PERMIT
    private String category;

    private String description;

    @Column(name = "expense_date")
    private LocalDate expenseDate;

    @Column(name = "vehicle_id")
    private Long vehicleId;
}