package com.transitops.service;

import com.transitops.entity.Expense;
import com.transitops.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense recordExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByVehicle(Long vehicleId) {
        return expenseRepository.findByVehicleId(vehicleId);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
}