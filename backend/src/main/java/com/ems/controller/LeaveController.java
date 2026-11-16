package com.ems.controller;

import com.ems.dto.*;
import com.ems.entity.LeaveApprovalHistory;
import com.ems.service.EmployeeService;
import com.ems.service.LeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leaves")
@Tag(name = "Leave Management", description = "Endpoints for leave requests, approvals, balances, and audit history")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/apply")
    @Operation(summary = "Submit a new leave application with date validation and balance check")
    public ResponseEntity<ApiResponse<LeaveResponseDTO>> applyForLeave(
            Authentication authentication,
            @Valid @RequestBody LeaveApplicationRequestDTO request) {
        LeaveResponseDTO response = leaveService.applyForLeave(authentication.getName(), request);
        return new ResponseEntity<>(ApiResponse.success("Leave applied successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    @Operation(summary = "Approve or reject a pending leave request")
    public ResponseEntity<ApiResponse<LeaveResponseDTO>> reviewLeave(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody LeaveApprovalRequestDTO request) {
        LeaveResponseDTO response = leaveService.reviewLeave(id, authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Leave reviewed: " + response.getStatus(), response));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an existing leave request and restore leave balance if applicable")
    public ResponseEntity<ApiResponse<LeaveResponseDTO>> cancelLeave(
            @PathVariable Long id,
            Authentication authentication) {
        LeaveResponseDTO response = leaveService.cancelLeave(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Leave request cancelled", response));
    }

    @GetMapping("/my-leaves")
    @Operation(summary = "View leave application history for authenticated user")
    public ResponseEntity<ApiResponse<List<LeaveResponseDTO>>> getMyLeaves(Authentication authentication) {
        EmployeeResponseDTO profile = employeeService.getEmployeeByUsername(authentication.getName());
        List<LeaveResponseDTO> leaves = leaveService.getEmployeeLeaves(profile.getId());
        return ResponseEntity.ok(ApiResponse.success("My leave requests", leaves));
    }

    @GetMapping("/my-balance")
    @Operation(summary = "View current year's remaining leave balance for authenticated user")
    public ResponseEntity<ApiResponse<LeaveBalanceResponseDTO>> getMyBalance(
            Authentication authentication,
            @RequestParam(required = false) Integer year) {
        EmployeeResponseDTO profile = employeeService.getEmployeeByUsername(authentication.getName());
        LeaveBalanceResponseDTO balance = leaveService.getLeaveBalance(profile.getId(), year);
        return ResponseEntity.ok(ApiResponse.success("Leave balance", balance));
    }

    @GetMapping("/balance/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    @Operation(summary = "View leave balance for a specific employee")
    public ResponseEntity<ApiResponse<LeaveBalanceResponseDTO>> getEmployeeBalance(
            @PathVariable Long employeeId,
            @RequestParam(required = false) Integer year) {
        LeaveBalanceResponseDTO balance = leaveService.getLeaveBalance(employeeId, year);
        return ResponseEntity.ok(ApiResponse.success("Employee leave balance", balance));
    }

    @GetMapping("/team-pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    @Operation(summary = "List pending leave requests for direct reports waiting for manager approval")
    public ResponseEntity<ApiResponse<List<LeaveResponseDTO>>> getPendingTeamLeaves(Authentication authentication) {
        List<LeaveResponseDTO> leaves = leaveService.getPendingTeamLeaves(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Pending team leaves", leaves));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "List all company-wide leave requests")
    public ResponseEntity<ApiResponse<List<LeaveResponseDTO>>> getAllLeaves() {
        List<LeaveResponseDTO> leaves = leaveService.getAllLeaves();
        return ResponseEntity.ok(ApiResponse.success("All leave applications", leaves));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "View audit trail for a specific leave request")
    public ResponseEntity<ApiResponse<List<LeaveApprovalHistory>>> getLeaveHistory(@PathVariable Long id) {
        List<LeaveApprovalHistory> history = leaveService.getLeaveApprovalHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Leave approval audit history", history));
    }
}
