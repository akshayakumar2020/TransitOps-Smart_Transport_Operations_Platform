package com.transitops.service;

import com.transitops.entity.Driver;
import com.transitops.entity.enums.DriverStatus;
import com.transitops.exception.ApiException;
import com.transitops.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public List<Driver> list(DriverStatus status) {
        if (status != null) return driverRepository.findByStatus(status);
        return driverRepository.findAll();
    }

    public Driver get(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ApiException("Driver not found", HttpStatus.NOT_FOUND));
    }

    public Driver register(Driver driver) {
        driver.setId(null);
        if (driver.getStatus() == null) driver.setStatus(DriverStatus.AVAILABLE);
        return driverRepository.save(driver);
    }

    public Driver update(Long id, Driver updated) {
        Driver existing = get(id);

        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getLicenseNumber() != null) existing.setLicenseNumber(updated.getLicenseNumber());
        if (updated.getLicenseCategory() != null) existing.setLicenseCategory(updated.getLicenseCategory());
        if (updated.getLicenseExpiryDate() != null) existing.setLicenseExpiryDate(updated.getLicenseExpiryDate());
        if (updated.getContactNumber() != null) existing.setContactNumber(updated.getContactNumber());
        if (updated.getSafetyScore() != null) existing.setSafetyScore(updated.getSafetyScore());

        if (updated.getStatus() != null) {
            if (existing.getStatus() == DriverStatus.ON_TRIP) {
                throw new ApiException("Cannot manually change status while driver is ON_TRIP", HttpStatus.BAD_REQUEST);
            }
            existing.setStatus(updated.getStatus());
        }

        return driverRepository.save(existing);
    }
}
