package com.ems.service;

import com.ems.dto.LeaveApplicationRequestDTO;
import com.ems.dto.LeaveApprovalRequestDTO;
import com.ems.dto.LeaveBalanceResponseDTO;
import com.ems.dto.LeaveResponseDTO;
import com.ems.entity.Employee;
import com.ems.entity.LeaveApprovalHistory;
import com.ems.entity.LeaveBalance;
import com.ems.entity.LeaveRequest;
import com.ems.enums.LeaveStatus;
import com.ems.enums.LeaveType;
import com.ems.enums.RoleType;
import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.exception.UnauthorizedException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveApprovalHistoryRepository;
import com.ems.repository.LeaveBalanceRepository;
import com.ems.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private LeaveApprovalHistoryRepository approvalHistoryRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public LeaveResponseDTO applyForLeave(String username, LeaveApplicationRequestDTO dto) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("No employee profile found for user: " + username));

        // 1. Validate Date Range
        LocalDate start = dto.getStartDate();
        LocalDate end = dto.getEndDate();

        if (start.isAfter(end)) {
            throw new BadRequestException("Start date cannot be after end date.");
        }
        if (start.isBefore(LocalDate.now())) {
            throw new BadRequestException("Leave cannot be applied for past dates.");
        }

        int requestedDays = (int) ChronoUnit.DAYS.between(start, end) + 1;
        if (requestedDays <= 0) {
            throw new BadRequestException("Total leave days must be at least 1 day.");
        }

        // 2. Prevent Overlapping Leave Requests
        List<LeaveRequest> overlapping = leaveRequestRepository.findOverlappingLeaves(employee.getId(), start, end);
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("You already have a pending or approved leave request that overlaps with these dates.");
        }

        // 3. Check Available Leave Balance
        int currentYear = start.getYear();
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndYear(employee.getId(), currentYear)
                .orElseGet(() -> leaveBalanceRepository.save(new LeaveBalance(employee, currentYear)));

        validateLeaveBalanceAvailable(balance, dto.getLeaveType(), requestedDays);

        // 4. Create Leave Request in PENDING status
        LeaveRequest request = new LeaveRequest();
        request.setEmployee(employee);
        request.setLeaveType(dto.getLeaveType());
        request.setStartDate(start);
        request.setEndDate(end);
        request.setTotalDays(requestedDays);
        request.setReason(dto.getReason().trim());
        request.setStatus(LeaveStatus.PENDING);

        LeaveRequest saved = leaveRequestRepository.save(request);

        // Record Initial Submission History
        approvalHistoryRepository.save(new LeaveApprovalHistory(
                saved, employee, LeaveStatus.PENDING, "Leave request submitted"
        ));

        return mapToResponse(saved);
    }

    @Transactional
    public LeaveResponseDTO reviewLeave(Long leaveId, String reviewerUsername, LeaveApprovalRequestDTO dto) {
        LeaveRequest request = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + leaveId));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("This leave request is already " + request.getStatus() + " and cannot be modified.");
        }

        Employee reviewer = employeeRepository.findByUserUsername(reviewerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer employee record not found for: " + reviewerUsername));

        // Rule: Employees cannot approve their own leave
        if (Objects.equals(request.getEmployee().getId(), reviewer.getId())) {
            throw new BadRequestException("You cannot approve or reject your own leave request.");
        }

        // Rule: Only authorized manager, HR, or Admin can review
        boolean isAdminOrHr = reviewer.getUser() != null && reviewer.getUser().getRoles().stream()
                .anyMatch(r -> r.getName() == RoleType.ROLE_ADMIN || r.getName() == RoleType.ROLE_HR);

        boolean isDirectManager = request.getEmployee().getManager() != null &&
                Objects.equals(request.getEmployee().getManager().getId(), reviewer.getId());

        if (!isAdminOrHr && !isDirectManager) {
            throw new UnauthorizedException("You are not authorized to review leave requests for this employee.");
        }

        LeaveStatus decision = dto.getStatus();
        if (decision != LeaveStatus.APPROVED && decision != LeaveStatus.REJECTED) {
            throw new BadRequestException("Invalid decision status. Must be APPROVED or REJECTED.");
        }

        request.setStatus(decision);
        request.setApprovedBy(reviewer);

        if (decision == LeaveStatus.APPROVED) {
            // Deduct from employee leave balance
            int year = request.getStartDate().getYear();
            LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndYear(request.getEmployee().getId(), year)
                    .orElseThrow(() -> new ResourceNotFoundException("Leave balance not found for year " + year));

            deductLeaveBalance(balance, request.getLeaveType(), request.getTotalDays());
            leaveBalanceRepository.save(balance);
        } else {
            request.setRejectionReason(dto.getComments() != null ? dto.getComments().trim() : "Rejected by manager");
        }

        LeaveRequest saved = leaveRequestRepository.save(request);

        // Record Audit History
        approvalHistoryRepository.save(new LeaveApprovalHistory(
                saved, reviewer, decision, dto.getComments()
        ));

        return mapToResponse(saved);
    }

    @Transactional
    public LeaveResponseDTO cancelLeave(Long leaveId, String username) {
        LeaveRequest request = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + leaveId));

        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for username: " + username));

        if (!Objects.equals(request.getEmployee().getId(), employee.getId())) {
            throw new UnauthorizedException("You can only cancel your own leave requests.");
        }

        if (request.getStatus() == LeaveStatus.CANCELLED || request.getStatus() == LeaveStatus.REJECTED) {
            throw new BadRequestException("Leave is already " + request.getStatus());
        }

        // Restore balance if already approved
        if (request.getStatus() == LeaveStatus.APPROVED) {
            if (request.getStartDate().isBefore(LocalDate.now())) {
                throw new BadRequestException("Cannot cancel an approved leave that has already started or completed.");
            }

            int year = request.getStartDate().getYear();
            LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndYear(employee.getId(), year)
                    .orElseThrow(() -> new ResourceNotFoundException("Leave balance not found for year " + year));

            restoreLeaveBalance(balance, request.getLeaveType(), request.getTotalDays());
            leaveBalanceRepository.save(balance);
        }

        request.setStatus(LeaveStatus.CANCELLED);
        LeaveRequest saved = leaveRequestRepository.save(request);

        approvalHistoryRepository.save(new LeaveApprovalHistory(
                saved, employee, LeaveStatus.CANCELLED, "Cancelled by employee"
        ));

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public LeaveBalanceResponseDTO getLeaveBalance(Long employeeId, Integer year) {
        int targetYear = year != null ? year : LocalDate.now().getYear();
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, targetYear)
                .orElseGet(() -> {
                    Employee emp = employeeRepository.findById(employeeId)
                            .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));
                    return leaveBalanceRepository.save(new LeaveBalance(emp, targetYear));
                });

        LeaveBalanceResponseDTO dto = new LeaveBalanceResponseDTO();
        dto.setId(balance.getId());
        dto.setEmployeeId(balance.getEmployee().getId());
        dto.setYear(balance.getYear());
        dto.setCasualLeaveBalance(balance.getCasualLeaveBalance());
        dto.setSickLeaveBalance(balance.getSickLeaveBalance());
        dto.setEarnedLeaveBalance(balance.getEarnedLeaveBalance());
        dto.setUnpaidLeaveUsed(balance.getUnpaidLeaveUsed());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<LeaveResponseDTO> getEmployeeLeaves(Long employeeId) {
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveResponseDTO> getPendingTeamLeaves(String managerUsername) {
        Employee manager = employeeRepository.findByUserUsername(managerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Manager profile not found: " + managerUsername));

        return leaveRequestRepository.findByEmployeeManagerIdOrderByCreatedAtDesc(manager.getId()).stream()
                .filter(lr -> lr.getStatus() == LeaveStatus.PENDING)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveResponseDTO> getAllLeaves() {
        return leaveRequestRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveApprovalHistory> getLeaveApprovalHistory(Long leaveRequestId) {
        return approvalHistoryRepository.findByLeaveRequestIdOrderByActionTimestampDesc(leaveRequestId);
    }

    private void validateLeaveBalanceAvailable(LeaveBalance balance, LeaveType type, int days) {
        switch (type) {
            case CASUAL:
                if (balance.getCasualLeaveBalance() < days) {
                    throw new BadRequestException("Insufficient Casual Leave balance. Available: " +
                            balance.getCasualLeaveBalance() + ", Requested: " + days);
                }
                break;
            case SICK:
                if (balance.getSickLeaveBalance() < days) {
                    throw new BadRequestException("Insufficient Sick Leave balance. Available: " +
                            balance.getSickLeaveBalance() + ", Requested: " + days);
                }
                break;
            case EARNED:
                if (balance.getEarnedLeaveBalance() < days) {
                    throw new BadRequestException("Insufficient Earned Leave balance. Available: " +
                            balance.getEarnedLeaveBalance() + ", Requested: " + days);
                }
                break;
            case UNPAID:
                // Unpaid leave has no hard cap limit
                break;
        }
    }

    private void deductLeaveBalance(LeaveBalance balance, LeaveType type, int days) {
        switch (type) {
            case CASUAL:
                balance.setCasualLeaveBalance(balance.getCasualLeaveBalance() - days);
                break;
            case SICK:
                balance.setSickLeaveBalance(balance.getSickLeaveBalance() - days);
                break;
            case EARNED:
                balance.setEarnedLeaveBalance(balance.getEarnedLeaveBalance() - days);
                break;
            case UNPAID:
                balance.setUnpaidLeaveUsed(balance.getUnpaidLeaveUsed() + days);
                break;
        }
    }

    private void restoreLeaveBalance(LeaveBalance balance, LeaveType type, int days) {
        switch (type) {
            case CASUAL:
                balance.setCasualLeaveBalance(balance.getCasualLeaveBalance() + days);
                break;
            case SICK:
                balance.setSickLeaveBalance(balance.getSickLeaveBalance() + days);
                break;
            case EARNED:
                balance.setEarnedLeaveBalance(balance.getEarnedLeaveBalance() + days);
                break;
            case UNPAID:
                balance.setUnpaidLeaveUsed(Math.max(0, balance.getUnpaidLeaveUsed() - days));
                break;
        }
    }

    private LeaveResponseDTO mapToResponse(LeaveRequest lr) {
        LeaveResponseDTO dto = new LeaveResponseDTO();
        dto.setId(lr.getId());
        dto.setEmployeeId(lr.getEmployee().getId());
        dto.setEmployeeName(lr.getEmployee().getFirstName() + " " + lr.getEmployee().getLastName());
        dto.setEmployeeCode(lr.getEmployee().getEmployeeCode());
        dto.setLeaveType(lr.getLeaveType());
        dto.setStartDate(lr.getStartDate());
        dto.setEndDate(lr.getEndDate());
        dto.setTotalDays(lr.getTotalDays());
        dto.setReason(lr.getReason());
        dto.setStatus(lr.getStatus());
        if (lr.getApprovedBy() != null) {
            dto.setApprovedById(lr.getApprovedBy().getId());
            dto.setApprovedByName(lr.getApprovedBy().getFirstName() + " " + lr.getApprovedBy().getLastName());
        }
        dto.setRejectionReason(lr.getRejectionReason());
        dto.setCreatedAt(lr.getCreatedAt());
        dto.setUpdatedAt(lr.getUpdatedAt());
        return dto;
    }
}
