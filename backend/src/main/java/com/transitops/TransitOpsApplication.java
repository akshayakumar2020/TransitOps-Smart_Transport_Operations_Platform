package com.transitops;

import com.transitops.entity.Vehicle;
import com.transitops.entity.Driver;
import com.transitops.entity.Trip;
import com.transitops.entity.MaintenanceLog;
import com.transitops.entity.enums.VehicleStatus;
import com.transitops.entity.enums.DriverStatus;
import com.transitops.entity.enums.TripStatus;
import com.transitops.entity.enums.MaintenanceStatus;
import com.transitops.entity.User;
import com.transitops.entity.enums.Role;
import com.transitops.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.transitops.repository.VehicleRepository;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.MaintenanceLogRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.time.LocalDate;

@SpringBootApplication
public class TransitOpsApplication {

    public static void main(String[] args) {
        SpringApplication.run(TransitOpsApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedData(
            VehicleRepository vehicleRepo,
            DriverRepository driverRepo,
            TripRepository tripRepo,
            MaintenanceLogRepository maintenanceRepo,
            UserRepository userRepo,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed User
            if (userRepo.findByEmail("finance@transitops.com").isEmpty()) {
                User financeUser = User.builder()
                        .name("Finance Admin")
                        .email("finance@transitops.com")
                        .password(passwordEncoder.encode("password123"))
                        .role(Role.FLEET_MANAGER)
                        .build();
                userRepo.save(financeUser);
            }

            if (userRepo.findByEmail("manager@transitops.com").isEmpty()) {
                User managerUser = User.builder()
                        .name("Fleet Manager")
                        .email("manager@transitops.com")
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.FLEET_MANAGER)
                        .build();
                userRepo.save(managerUser);
            }

            if (userRepo.findByEmail("driver@transitops.com").isEmpty()) {
                User driverUser = User.builder()
                        .name("Driver User")
                        .email("driver@transitops.com")
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.DRIVER)
                        .build();
                userRepo.save(driverUser);
            }

            if (userRepo.findByEmail("safety@transitops.com").isEmpty()) {
                User safetyUser = User.builder()
                        .name("Safety Officer")
                        .email("safety@transitops.com")
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.SAFETY_OFFICER)
                        .build();
                userRepo.save(safetyUser);
            }

            if (userRepo.findByEmail("analyst@transitops.com").isEmpty()) {
                User analystUser = User.builder()
                        .name("Financial Analyst")
                        .email("analyst@transitops.com")
                        .password(passwordEncoder.encode("Password@123"))
                        .role(Role.FINANCIAL_ANALYST)
                        .build();
                userRepo.save(analystUser);
            }
            // Seed Vehicles
            Vehicle v1 = vehicleRepo.findByRegistrationNumber("VAN-01").orElse(null);
            if (v1 == null) {
                v1 = Vehicle.builder()
                        .registrationNumber("VAN-01")
                        .nameModel("Transit Cargo Van")
                        .type("van")
                        .maxLoadCapacity(1200.0)
                        .odometer(15000.0)
                        .acquisitionCost(32000.0)
                        .status(VehicleStatus.AVAILABLE)
                        .build();
                v1 = vehicleRepo.save(v1);
            }

            Vehicle v2 = vehicleRepo.findByRegistrationNumber("TRUCK-02").orElse(null);
            if (v2 == null) {
                v2 = Vehicle.builder()
                        .registrationNumber("TRUCK-02")
                        .nameModel("Heavy Duty Hauler")
                        .type("truck")
                        .maxLoadCapacity(5000.0)
                        .odometer(42000.0)
                        .acquisitionCost(75000.0)
                        .status(VehicleStatus.AVAILABLE)
                        .build();
                v2 = vehicleRepo.save(v2);
            }

            Vehicle v3 = vehicleRepo.findByRegistrationNumber("VAN-03").orElse(null);
            if (v3 == null) {
                v3 = Vehicle.builder()
                        .registrationNumber("VAN-03")
                        .nameModel("Transit Express Van")
                        .type("van")
                        .maxLoadCapacity(1500.0)
                        .odometer(8000.0)
                        .acquisitionCost(35000.0)
                        .status(VehicleStatus.AVAILABLE)
                        .build();
                v3 = vehicleRepo.save(v3);
            }

            // Seed Drivers
            String driverEmail = "driver@transitops.com";
            if (userRepo.findByEmail("deviakanksha16@gmail.com").isPresent()) {
                driverEmail = "deviakanksha16@gmail.com";
            }

            final String finalDriverEmail = driverEmail;
            Driver d1 = driverRepo.findAll().stream()
                    .filter(d -> "DL123456".equals(d.getLicenseNumber()))
                    .findFirst().orElse(null);
            if (d1 == null) {
                d1 = Driver.builder()
                        .name("Alex Johnson")
                        .licenseNumber("DL123456")
                        .licenseCategory("Class A")
                        .licenseExpiryDate(LocalDate.now().plusYears(4))
                        .contactNumber("+15551234567")
                        .safetyScore(95.0)
                        .email(finalDriverEmail)
                        .status(DriverStatus.AVAILABLE)
                        .build();
                d1 = driverRepo.save(d1);
            } else if (!finalDriverEmail.equals(d1.getEmail())) {
                d1.setEmail(finalDriverEmail);
                d1 = driverRepo.save(d1);
            }

            Driver d2 = driverRepo.findAll().stream()
                    .filter(d -> "DL789012".equals(d.getLicenseNumber()))
                    .findFirst().orElse(null);
            if (d2 == null) {
                d2 = Driver.builder()
                        .name("Bob Miller")
                        .licenseNumber("DL789012")
                        .licenseCategory("Class B")
                        .licenseExpiryDate(LocalDate.now().plusYears(2))
                        .contactNumber("+15559876543")
                        .safetyScore(88.0)
                        .email("driver2@transitops.com")
                        .status(DriverStatus.AVAILABLE)
                        .build();
                d2 = driverRepo.save(d2);
            } else if (!"driver2@transitops.com".equals(d2.getEmail())) {
                d2.setEmail("driver2@transitops.com");
                d2 = driverRepo.save(d2);
            }

            Driver d3 = driverRepo.findAll().stream()
                    .filter(d -> "DL456789".equals(d.getLicenseNumber()))
                    .findFirst().orElse(null);
            if (d3 == null) {
                d3 = Driver.builder()
                        .name("Charlie Green")
                        .licenseNumber("DL456789")
                        .licenseCategory("Class C")
                        .licenseExpiryDate(LocalDate.now().plusYears(3))
                        .contactNumber("+15554567890")
                        .safetyScore(92.0)
                        .email("driver3@transitops.com")
                        .status(DriverStatus.AVAILABLE)
                        .build();
                d3 = driverRepo.save(d3);
            } else if (!"driver3@transitops.com".equals(d3.getEmail())) {
                d3.setEmail("driver3@transitops.com");
                d3 = driverRepo.save(d3);
            }

            // Seed Trips
            if (tripRepo.count() < 3) {
                if (v1 != null && d1 != null) {
                    Trip t1 = Trip.builder()
                            .source("Warehouse A")
                            .destination("Distribution Center B")
                            .cargoWeight(800.0)
                            .plannedDistance(120.0)
                            .vehicle(v1)
                            .driver(d1)
                            .status(TripStatus.DRAFT)
                            .build();
                    tripRepo.save(t1);
                }

                if (v3 != null && d3 != null) {
                    Trip t2 = Trip.builder()
                            .source("Warehouse C")
                            .destination("Client Port D")
                            .cargoWeight(1100.0)
                            .plannedDistance(250.0)
                            .vehicle(v3)
                            .driver(d3)
                            .status(TripStatus.DISPATCHED)
                            .build();
                    
                    v3.setStatus(VehicleStatus.ON_TRIP);
                    d3.setStatus(DriverStatus.ON_TRIP);
                    vehicleRepo.save(v3);
                    driverRepo.save(d3);
                    tripRepo.save(t2);
                }
            }

            // Seed Maintenance Log
            if (maintenanceRepo.count() == 0 && v2 != null) {
                MaintenanceLog m1 = MaintenanceLog.builder()
                        .vehicle(v2)
                        .description("Brake pads replacement & Oil service")
                        .cost(350.0)
                        .status(MaintenanceStatus.OPEN)
                        .createdDate(LocalDate.now())
                        .build();
                
                v2.setStatus(VehicleStatus.IN_SHOP);
                vehicleRepo.save(v2);
                maintenanceRepo.save(m1);
            }
        };
    }
}
