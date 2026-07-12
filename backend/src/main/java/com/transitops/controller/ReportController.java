package com.transitops.controller;

import com.transitops.dto.VehicleCostReport;
import com.transitops.service.ReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/operational-cost")
    public ResponseEntity<List<VehicleCostReport>> operationalCost() {
        return ResponseEntity.ok(reportService.operationalCostReport());
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv() {
        byte[] csv = reportService.exportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transitops-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
