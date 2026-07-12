package com.transitops.service;

import com.transitops.dto.TripCompleteRequest;
import com.transitops.dto.TripRequest;
import com.transitops.entity.Driver;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.entity.enums.DriverStatus;
import com.transitops.entity.enums.TripStatus;
import com.transitops.entity.enums.VehicleStatus;
import com.transitops.exception.ApiException;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public List<Trip> list(TripStatus status, String email, String role) {
        if ("DRIVER".equals(role)) {
            Driver driver = driverRepository.findByEmail(email).orElse(null);
            if (driver == null) return List.of();
            if (status != null) return tripRepository.findByDriverAndStatus(driver, status);
            return tripRepository.findByDriver(driver);
        }
        if (status != null) return tripRepository.findByStatus(status);
        return tripRepository.findAll();
    }

    public Trip get(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ApiException("Trip not found", HttpStatus.NOT_FOUND));
    }

    @Transactional
    public Trip create(TripRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ApiException("Vehicle not found", HttpStatus.NOT_FOUND));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ApiException("Driver not found", HttpStatus.NOT_FOUND));

        validateAssignment(vehicle, driver, request.getCargoWeight());

        Trip trip = Trip.builder()
                .source(request.getSource())
                .destination(request.getDestination())
                .vehicle(vehicle)
                .driver(driver)
                .cargoWeight(request.getCargoWeight())
                .plannedDistance(request.getPlannedDistance())
                .status(TripStatus.DRAFT)
                .build();

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip dispatch(Long tripId) {
        Trip trip = get(tripId);

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new ApiException("Only DRAFT trips can be dispatched", HttpStatus.BAD_REQUEST);
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        validateAssignment(vehicle, driver, trip.getCargoWeight());

        trip.setStatus(TripStatus.DISPATCHED);
        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip complete(Long tripId, TripCompleteRequest request) {
        Trip trip = get(tripId);

        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new ApiException("Only DISPATCHED trips can be completed", HttpStatus.BAD_REQUEST);
        }

        trip.setFinalOdometer(request.getFinalOdometer());
        trip.setFuelConsumed(request.getFuelConsumed());
        trip.setStatus(TripStatus.COMPLETED);

        Vehicle vehicle = trip.getVehicle();
        vehicle.setOdometer(request.getFinalOdometer());
        vehicle.setStatus(VehicleStatus.AVAILABLE);

        Driver driver = trip.getDriver();
        driver.setStatus(DriverStatus.AVAILABLE);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip cancel(Long tripId) {
        Trip trip = get(tripId);

        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new ApiException("Only DISPATCHED trips can be cancelled", HttpStatus.BAD_REQUEST);
        }

        trip.setStatus(TripStatus.CANCELLED);

        Vehicle vehicle = trip.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);

        Driver driver = trip.getDriver();
        driver.setStatus(DriverStatus.AVAILABLE);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);
        return tripRepository.save(trip);
    }

    private void validateAssignment(Vehicle vehicle, Driver driver, Double cargoWeight) {
        if (vehicle.getStatus() == VehicleStatus.RETIRED || vehicle.getStatus() == VehicleStatus.IN_SHOP) {
            throw new ApiException("Vehicle is not available for trips (Retired/In Shop)", HttpStatus.BAD_REQUEST);
        }
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new ApiException("Vehicle is already on another trip", HttpStatus.BAD_REQUEST);
        }
        if (driver.getStatus() == DriverStatus.SUSPENDED) {
            throw new ApiException("Driver is suspended", HttpStatus.BAD_REQUEST);
        }
        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new ApiException("Driver is already on another trip", HttpStatus.BAD_REQUEST);
        }
        if (driver.getLicenseExpiryDate() != null && driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new ApiException("Driver's license has expired", HttpStatus.BAD_REQUEST);
        }
        if (vehicle.getMaxLoadCapacity() != null && cargoWeight > vehicle.getMaxLoadCapacity()) {
            throw new ApiException("Cargo weight exceeds vehicle's max load capacity", HttpStatus.BAD_REQUEST);
        }
    }
}
