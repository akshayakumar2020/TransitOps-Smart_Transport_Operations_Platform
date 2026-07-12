package com.transitops.service;

import com.transitops.entity.Vehicle;
import com.transitops.entity.enums.VehicleStatus;
import com.transitops.exception.ApiException;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<Vehicle> list(VehicleStatus status, String type) {
        if (status != null) return vehicleRepository.findByStatus(status);
        if (type != null) return vehicleRepository.findByType(type);
        return vehicleRepository.findAll();
    }

    public Vehicle get(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ApiException("Vehicle not found", HttpStatus.NOT_FOUND));
    }

    public Vehicle register(Vehicle vehicle) {
        if (vehicleRepository.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new ApiException("Registration number already exists", HttpStatus.CONFLICT);
        }
        vehicle.setId(null);
        if (vehicle.getStatus() == null) vehicle.setStatus(VehicleStatus.AVAILABLE);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle update(Long id, Vehicle updated) {
        Vehicle existing = get(id);

        // registration number uniqueness check if changed
        if (updated.getRegistrationNumber() != null &&
                !updated.getRegistrationNumber().equals(existing.getRegistrationNumber()) &&
                vehicleRepository.existsByRegistrationNumber(updated.getRegistrationNumber())) {
            throw new ApiException("Registration number already exists", HttpStatus.CONFLICT);
        }

        if (updated.getRegistrationNumber() != null) existing.setRegistrationNumber(updated.getRegistrationNumber());
        if (updated.getNameModel() != null) existing.setNameModel(updated.getNameModel());
        if (updated.getType() != null) existing.setType(updated.getType());
        if (updated.getMaxLoadCapacity() != null) existing.setMaxLoadCapacity(updated.getMaxLoadCapacity());
        if (updated.getOdometer() != null) existing.setOdometer(updated.getOdometer());
        if (updated.getAcquisitionCost() != null) existing.setAcquisitionCost(updated.getAcquisitionCost());

        // Status is system-managed for ON_TRIP / IN_SHOP - only allow manual set to
        // AVAILABLE or RETIRED from here (never mid-trip / mid-maintenance overrides).
        if (updated.getStatus() != null) {
            if (existing.getStatus() == VehicleStatus.ON_TRIP || existing.getStatus() == VehicleStatus.IN_SHOP) {
                throw new ApiException("Cannot manually change status while vehicle is ON_TRIP or IN_SHOP", HttpStatus.BAD_REQUEST);
            }
            existing.setStatus(updated.getStatus());
        }

        return vehicleRepository.save(existing);
    }
}
