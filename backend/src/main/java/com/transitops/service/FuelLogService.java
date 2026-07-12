package com.transitops.service;

import com.transitops.entity.FuelLog;
import com.transitops.repository.FuelLogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FuelLogService {

    private final FuelLogRepository fuelLogRepository;

    public FuelLogService(FuelLogRepository fuelLogRepository) {
        this.fuelLogRepository = fuelLogRepository;
    }

    public FuelLog logFuel(FuelLog fuelLog) {
        // Business Logic: Agar front-end se totalCost calculate hoke nahi aaya, toh auto-calculate karein
        if (fuelLog.getTotalCost() == null || fuelLog.getTotalCost() == 0) {
            fuelLog.setTotalCost(fuelLog.getLiters() * fuelLog.getPricePerLiter());
        }
        return fuelLogRepository.save(fuelLog);
    }

    public List<FuelLog> getLogsByVehicle(Long vehicleId) {
        return fuelLogRepository.findByVehicleId(vehicleId);
    }

    public List<FuelLog> getAllLogs() {
        return fuelLogRepository.findAll();
    }
}
