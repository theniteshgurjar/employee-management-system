package com.ems;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

/**
 * Main Entry Point for the Employee Management System (EMS) REST API.
 * 
 * In Spring Boot:
 * - @SpringBootApplication enables component scanning, auto-configuration,
 *   and configuration property support.
 */
@SpringBootApplication
public class EmployeeManagementSystemApplication {

    @PostConstruct
    public void init() {
        // Enforce UTC timezone to prevent negative epoch millisecond discrepancies
        // in JDBC/Hibernate temporal conversions
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(EmployeeManagementSystemApplication.class, args);
    }
}
