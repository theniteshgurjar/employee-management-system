package com.ems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for the Employee Management System (EMS) REST API.
 * 
 * In Spring Boot:
 * - @SpringBootApplication enables component scanning, auto-configuration,
 *   and configuration property support.
 */
@SpringBootApplication
public class EmployeeManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeManagementSystemApplication.class, args);
    }
}
