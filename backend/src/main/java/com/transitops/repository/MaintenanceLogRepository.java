package com.transitops.repository;

import com.transitops.entity.MaintenanceLog;
import com.transitops.entity.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {
    List<MaintenanceLog> findByVehicleId(Long vehicleId);
    List<MaintenanceLog> findByStatus(MaintenanceStatus status);

    @org.springframework.data.jpa.repository.Query(
        "SELECT COALESCE(SUM(m.cost), 0) FROM MaintenanceLog m WHERE m.vehicle.id = :vehicleId")
    Double sumCostByVehicleId(Long vehicleId);
}
