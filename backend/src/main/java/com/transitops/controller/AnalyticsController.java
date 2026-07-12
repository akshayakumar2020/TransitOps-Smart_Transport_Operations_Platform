package com.transitops.controller;

import com.transitops.entity.Expense;
import com.transitops.entity.FuelLog;
import com.transitops.service.ExpenseService;
import com.transitops.service.FuelLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final ExpenseService expenseService;
    private final FuelLogService fuelLogService;

    public AnalyticsController(ExpenseService expenseService, FuelLogService fuelLogService) {
        this.expenseService = expenseService;
        this.fuelLogService = fuelLogService;
    }

    // 1. New Expense entry record karne ke liye
    @PostMapping("/expense")
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.recordExpense(expense));
    }

    // 2. New Fuel entry log karne ke liye (Automated cost calculation logic runs here)
    @PostMapping("/fuel")
    public ResponseEntity<FuelLog> addFuelLog(@RequestBody FuelLog fuelLog) {
        return ResponseEntity.ok(fuelLogService.logFuel(fuelLog));
    }

    // 3. Kisi specific vehicle ke saare fuel logs nikalne ke liye
    @GetMapping("/vehicle/{vehicleId}/fuel")
    public ResponseEntity<List<FuelLog>> getVehicleFuelLogs(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(fuelLogService.getLogsByVehicle(vehicleId));
    }

    // 4. Saare logged expenses fetch karne ke liye (Analyst metrics mapping)
    @GetMapping("/expenses")
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    // 5. Saare fuel logs fetch karne ke liye
    @GetMapping("/fuel-logs")
    public ResponseEntity<List<FuelLog>> getAllFuelLogs() {
        return ResponseEntity.ok(fuelLogService.getAllLogs());
    }
}