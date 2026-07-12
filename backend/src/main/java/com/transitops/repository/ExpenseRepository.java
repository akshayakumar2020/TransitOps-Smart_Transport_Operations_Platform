package com.transitops.repository;

import com.transitops.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByVehicleId(Long vehicleId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.vehicle.id = :vehicleId")
    Double sumAmountByVehicleId(Long vehicleId);
}
