package com.ems.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Lightweight health check endpoint for cloud keep-alive workers,
 * load balancers, and monitoring services (e.g. cron-job.org, UptimeRobot, Render).
 */
@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Application health & keep-alive monitor endpoint")
public class HealthController {

    @GetMapping
    @Operation(summary = "Health check and keep-alive ping")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Employee Management System API",
            "timestamp", Instant.now().toString()
        ));
    }
}
