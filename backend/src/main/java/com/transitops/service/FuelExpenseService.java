package com.transitops.service;

import com.transitops.dto.ExpenseRequest;
import com.transitops.dto.FuelLogRequest;
import com.transitops.entity.Expense;
import com.transitops.entity.FuelLog;
import com.transitops.entity.Vehicle;
import com.transitops.exception.ApiException;
import com.transitops.repository.ExpenseRepository;
import com.transitops.repository.FuelLogRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuelExpenseService {

    private final FuelLogRepository fuelLogRepository;
    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;

    public List<FuelLog> listFuelLogs() {
        return fuelLogRepository.findAll();
    }

    public List<Expense> listExpenses() {
        return expenseRepository.findAll();
    }

    public FuelLog addFuelLog(FuelLogRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ApiException("Vehicle not found", HttpStatus.NOT_FOUND));

        FuelLog log = FuelLog.builder()
                .vehicle(vehicle)
                .liters(request.getLiters())
                .cost(request.getCost())
                .date(request.getDate())
                .build();

        return fuelLogRepository.save(log);
    }

    public Expense addExpense(ExpenseRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ApiException("Vehicle not found", HttpStatus.NOT_FOUND));

        Expense expense = Expense.builder()
                .vehicle(vehicle)
                .type(request.getType())
                .amount(request.getAmount())
                .date(request.getDate())
                .build();

        return expenseRepository.save(expense);
    }

    public double operationalCost(Long vehicleId) {
        double fuel = fuelLogRepository.sumCostByVehicleId(vehicleId);
        double maintenance = expenseRepository.sumAmountByVehicleId(vehicleId);
        return fuel + maintenance;
    }
}
