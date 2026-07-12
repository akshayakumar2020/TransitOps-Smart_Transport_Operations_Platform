package com.transitops.repository;

import com.transitops.entity.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {
    List<FuelLog> findByVehicleId(Long vehicleId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(SUM(f.cost), 0) FROM FuelLog f WHERE f.vehicle.id = :vehicleId")
    Double sumCostByVehicleId(Long vehicleId);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(SUM(f.liters), 0) FROM FuelLog f WHERE f.vehicle.id = :vehicleId")
    Double sumLitersByVehicleId(Long vehicleId);
}
