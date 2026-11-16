package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.AttendanceCheckInRequestDTO;
import com.ems.dto.AttendanceCheckOutRequestDTO;
import com.ems.dto.AttendanceResponseDTO;
import com.ems.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/attendance")
@Tag(name = "Attendance Management", description = "Endpoints for employee daily check-in, check-out, and logs")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/check-in")
    @Operation(summary = "Punch in for today's workday")
    public ResponseEntity<ApiResponse<AttendanceResponseDTO>> checkIn(
            Authentication authentication,
            @RequestBody(required = false) AttendanceCheckInRequestDTO request) {
        AttendanceResponseDTO response = attendanceService.checkIn(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Checked in successfully", response));
    }

    @PostMapping("/check-out")
    @Operation(summary = "Punch out and compute completed daily working hours")
    public ResponseEntity<ApiResponse<AttendanceResponseDTO>> checkOut(
            Authentication authentication,
            @RequestBody(required = false) AttendanceCheckOutRequestDTO request) {
        AttendanceResponseDTO response = attendanceService.checkOut(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Checked out successfully", response));
    }

    @GetMapping("/today")
    @Operation(summary = "Get current day's check-in/out status for authenticated user")
    public ResponseEntity<ApiResponse<AttendanceResponseDTO>> getTodayAttendance(Authentication authentication) {
        AttendanceResponseDTO today = attendanceService.getTodayAttendance(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Today's attendance status", today));
    }

    @GetMapping("/my-history")
    @Operation(summary = "Get historical attendance log for authenticated user")
    public ResponseEntity<ApiResponse<List<AttendanceResponseDTO>>> getMyAttendance(Authentication authentication) {
        AttendanceResponseDTO today = attendanceService.getTodayAttendance(authentication.getName());
        if (today == null) {
            return ResponseEntity.ok(ApiResponse.success("No attendance history found", List.of()));
        }
        List<AttendanceResponseDTO> history = attendanceService.getEmployeeAttendanceHistory(today.getEmployeeId());
        return ResponseEntity.ok(ApiResponse.success("Attendance history", history));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    @Operation(summary = "View attendance history for a specific employee")
    public ResponseEntity<ApiResponse<List<AttendanceResponseDTO>>> getEmployeeAttendance(@PathVariable Long employeeId) {
        List<AttendanceResponseDTO> history = attendanceService.getEmployeeAttendanceHistory(employeeId);
        return ResponseEntity.ok(ApiResponse.success("Employee attendance records", history));
    }

    @GetMapping("/daily")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "View enterprise attendance roster for a specific date")
    public ResponseEntity<ApiResponse<List<AttendanceResponseDTO>>> getDailyAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceResponseDTO> records = attendanceService.getAllAttendanceByDate(date);
        return ResponseEntity.ok(ApiResponse.success("Daily attendance report", records));
    }
}
