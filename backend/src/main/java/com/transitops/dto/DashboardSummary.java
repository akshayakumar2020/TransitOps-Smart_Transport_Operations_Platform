package com.transitops.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardSummary {
    private long activeVehicles;
    private long availableVehicles;
    private long vehiclesInMaintenance;
    private long activeTrips;
    private long pendingTrips;
    private long driversOnDuty;
    private double fleetUtilization;
}
