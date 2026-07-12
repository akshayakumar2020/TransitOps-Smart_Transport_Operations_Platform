package com.transitops.controller;

import com.transitops.dto.ExpenseRequest;
import com.transitops.dto.FuelLogRequest;
import com.transitops.entity.Expense;
import com.transitops.entity.FuelLog;
import com.transitops.service.FuelExpenseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Fuel & Expenses")
public class FuelExpenseController {

    private final FuelExpenseService fuelExpenseService;

    @GetMapping("/api/fuel-logs")
    public ResponseEntity<List<FuelLog>> listFuelLogs() {
        return ResponseEntity.ok(fuelExpenseService.listFuelLogs());
    }

    @PostMapping("/api/fuel-logs")
    public ResponseEntity<FuelLog> addFuelLog(@Valid @RequestBody FuelLogRequest request) {
        return ResponseEntity.ok(fuelExpenseService.addFuelLog(request));
    }

    @GetMapping("/api/expenses")
    public ResponseEntity<List<Expense>> listExpenses() {
        return ResponseEntity.ok(fuelExpenseService.listExpenses());
    }

    @PostMapping("/api/expenses")
    public ResponseEntity<Expense> addExpense(@Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(fuelExpenseService.addExpense(request));
    }
}
