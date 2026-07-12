package com.transitops.service;

import com.transitops.dto.VehicleCostReport;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.entity.enums.TripStatus;
import com.transitops.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final VehicleRepository vehicleRepository;
    private final FuelLogRepository fuelLogRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;

    public List<VehicleCostReport> operationalCostReport() {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        return vehicles.stream().map(v -> {
            double fuelCost = safe(fuelLogRepository.sumCostByVehicleId(v.getId()));
            double maintenanceCost = safe(maintenanceLogRepository.sumCostByVehicleId(v.getId()));
            double expenseCost = safe(expenseRepository.sumAmountByVehicleId(v.getId()));
            double totalFuelConsumed = safe(fuelLogRepository.sumLitersByVehicleId(v.getId()));

            List<Trip> completedTrips = tripRepository.findAll().stream()
                    .filter(t -> t.getStatus() == TripStatus.COMPLETED
                            && t.getVehicle() != null
                            && t.getVehicle().getId().equals(v.getId()))
                    .collect(Collectors.toList());

            double totalDistance = completedTrips.stream()
                    .mapToDouble(t -> t.getPlannedDistance() != null ? t.getPlannedDistance() : 0.0)
                    .sum();

            double operationalCost = fuelCost + maintenanceCost + expenseCost;
            double fuelEfficiency = totalFuelConsumed > 0 ? totalDistance / totalFuelConsumed : 0;

            // Simplified revenue proxy: assume no separate revenue tracking in MVP -> ROI based on cost avoidance
            double acquisitionCost = v.getAcquisitionCost() != null ? v.getAcquisitionCost() : 0.0;
            double revenue = 0.0; // placeholder - extend with a Revenue entity if time allows
            double roi = acquisitionCost > 0 ? (revenue - operationalCost) / acquisitionCost : 0.0;

            return VehicleCostReport.builder()
                    .vehicleId(v.getId())
                    .registrationNumber(v.getRegistrationNumber())
                    .nameModel(v.getNameModel())
                    .fuelCost(fuelCost)
                    .maintenanceCost(maintenanceCost)
                    .operationalCost(operationalCost)
                    .totalDistance(totalDistance)
                    .totalFuelConsumed(totalFuelConsumed)
                    .fuelEfficiency(Math.round(fuelEfficiency * 100.0) / 100.0)
                    .acquisitionCost(acquisitionCost)
                    .roi(Math.round(roi * 10000.0) / 10000.0)
                    .build();
        }).collect(Collectors.toList());
    }

    public byte[] exportCsv() {
        List<VehicleCostReport> report = operationalCostReport();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(baos, true, StandardCharsets.UTF_8)) {
            writer.println("Vehicle ID,Registration Number,Name/Model,Fuel Cost,Maintenance Cost,Operational Cost,Total Distance (km),Total Fuel Consumed (L),Fuel Efficiency (km/L),Acquisition Cost,ROI");
            for (VehicleCostReport r : report) {
                writer.printf("%d,%s,%s,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.4f%n",
                        r.getVehicleId(), csvSafe(r.getRegistrationNumber()), csvSafe(r.getNameModel()),
                        r.getFuelCost(), r.getMaintenanceCost(), r.getOperationalCost(),
                        r.getTotalDistance(), r.getTotalFuelConsumed(), r.getFuelEfficiency(),
                        r.getAcquisitionCost(), r.getRoi());
            }
        }
        return baos.toByteArray();
    }

    private double safe(Double val) {
        return val != null ? val : 0.0;
    }

    private String csvSafe(String val) {
        if (val == null) return "";
        return val.replace(",", " ");
    }
}
