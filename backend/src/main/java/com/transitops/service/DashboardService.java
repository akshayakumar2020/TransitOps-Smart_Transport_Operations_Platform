package com.transitops.service;

import com.transitops.dto.DashboardSummary;
import com.transitops.entity.enums.DriverStatus;
import com.transitops.entity.enums.TripStatus;
import com.transitops.entity.enums.VehicleStatus;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardSummary getSummary() {
        long totalVehicles = vehicleRepository.count();
        long retired = vehicleRepository.findByStatus(VehicleStatus.RETIRED).size();
        long activeVehicles = totalVehicles - retired;

        long availableVehicles = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE).size();
        long inMaintenance = vehicleRepository.findByStatus(VehicleStatus.IN_SHOP).size();
        long onTrip = vehicleRepository.findByStatus(VehicleStatus.ON_TRIP).size();

        long activeTrips = tripRepository.findByStatus(TripStatus.DISPATCHED).size();
        long pendingTrips = tripRepository.findByStatus(TripStatus.DRAFT).size();

        long driversOnDuty = driverRepository.findByStatus(DriverStatus.ON_TRIP).size()
                + driverRepository.findByStatus(DriverStatus.AVAILABLE).size();

        double utilization = activeVehicles == 0 ? 0 : (onTrip * 100.0) / activeVehicles;

        return DashboardSummary.builder()
                .activeVehicles(activeVehicles)
                .availableVehicles(availableVehicles)
                .vehiclesInMaintenance(inMaintenance)
                .activeTrips(activeTrips)
                .pendingTrips(pendingTrips)
                .driversOnDuty(driversOnDuty)
                .fleetUtilization(Math.round(utilization * 100.0) / 100.0)
                .build();
    }
}
