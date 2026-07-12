package com.transitops.service;

import com.transitops.dto.MaintenanceRequest;
import com.transitops.entity.MaintenanceLog;
import com.transitops.entity.Vehicle;
import com.transitops.entity.enums.MaintenanceStatus;
import com.transitops.entity.enums.VehicleStatus;
import com.transitops.exception.ApiException;
import com.transitops.repository.MaintenanceLogRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final VehicleRepository vehicleRepository;

    public List<MaintenanceLog> list() {
        return maintenanceLogRepository.findAll();
    }

    @Transactional
    public MaintenanceLog create(MaintenanceRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ApiException("Vehicle not found", HttpStatus.NOT_FOUND));

        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new ApiException("Cannot open maintenance while vehicle is ON_TRIP", HttpStatus.BAD_REQUEST);
        }
        if (vehicle.getStatus() == VehicleStatus.RETIRED) {
            throw new ApiException("Cannot open maintenance for a RETIRED vehicle", HttpStatus.BAD_REQUEST);
        }

        MaintenanceLog log = MaintenanceLog.builder()
                .vehicle(vehicle)
                .description(request.getDescription())
                .cost(request.getCost())
                .status(MaintenanceStatus.OPEN)
                .createdDate(LocalDate.now())
                .build();

        vehicle.setStatus(VehicleStatus.IN_SHOP);
        vehicleRepository.save(vehicle);

        return maintenanceLogRepository.save(log);
    }

    @Transactional
    public MaintenanceLog close(Long id) {
        MaintenanceLog log = maintenanceLogRepository.findById(id)
                .orElseThrow(() -> new ApiException("Maintenance record not found", HttpStatus.NOT_FOUND));

        if (log.getStatus() == MaintenanceStatus.CLOSED) {
            throw new ApiException("Maintenance record already closed", HttpStatus.BAD_REQUEST);
        }

        log.setStatus(MaintenanceStatus.CLOSED);
        log.setClosedDate(LocalDate.now());

        Vehicle vehicle = log.getVehicle();
        if (vehicle.getStatus() != VehicleStatus.RETIRED) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
        }

        return maintenanceLogRepository.save(log);
    }
}
