package com.transitops.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VehicleCostReport {
    private Long vehicleId;
    private String registrationNumber;
    private String nameModel;
    private double fuelCost;
    private double maintenanceCost;
    private double operationalCost;
    private double totalDistance;
    private double totalFuelConsumed;
    private double fuelEfficiency;
    private double acquisitionCost;
    private double roi;
}
