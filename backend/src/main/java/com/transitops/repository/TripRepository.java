package com.transitops.repository;

import com.transitops.entity.Trip;
import com.transitops.entity.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(TripStatus status);
    List<Trip> findByDriver(com.transitops.entity.Driver driver);
    List<Trip> findByDriverAndStatus(com.transitops.entity.Driver driver, TripStatus status);
}
