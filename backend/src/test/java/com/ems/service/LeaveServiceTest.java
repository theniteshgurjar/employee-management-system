package com.ems.service;

import com.ems.dto.LeaveApplicationRequestDTO;
import com.ems.dto.LeaveApprovalRequestDTO;
import com.ems.dto.LeaveResponseDTO;
import com.ems.entity.Employee;
import com.ems.entity.LeaveBalance;
import com.ems.entity.LeaveRequest;
import com.ems.entity.Role;
import com.ems.entity.User;
import com.ems.enums.LeaveStatus;
import com.ems.enums.LeaveType;
import com.ems.enums.RoleType;
import com.ems.exception.BadRequestException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveApprovalHistoryRepository;
import com.ems.repository.LeaveBalanceRepository;
import com.ems.repository.LeaveRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private LeaveBalanceRepository leaveBalanceRepository;

    @Mock
    private LeaveApprovalHistoryRepository approvalHistoryRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private LeaveService leaveService;

    private Employee employee;
    private Employee manager;
    private LeaveBalance leaveBalance;

    @BeforeEach
    void setUp() {
        employee = new Employee();
        employee.setId(10L);
        employee.setEmployeeCode("EMP010");
        employee.setFirstName("John");
        employee.setLastName("Doe");

        User empUser = new User("john_doe", "john@ems.com", "pass");
        empUser.setId(10L);
        employee.setUser(empUser);

        manager = new Employee();
        manager.setId(20L);
        manager.setEmployeeCode("MGR020");
        manager.setFirstName("Sarah");
        manager.setLastName("Manager");

        User mgrUser = new User("sarah_mgr", "sarah@ems.com", "pass");
        mgrUser.setId(20L);
        mgrUser.setRoles(Set.of(new Role(RoleType.ROLE_MANAGER)));
        manager.setUser(mgrUser);

        employee.setManager(manager);

        leaveBalance = new LeaveBalance(employee, LocalDate.now().getYear());
        leaveBalance.setCasualLeaveBalance(5);
        leaveBalance.setSickLeaveBalance(5);
        leaveBalance.setEarnedLeaveBalance(10);
    }

    @Test
    @DisplayName("Should apply for leave successfully when balance is sufficient and no overlap")
    void testApplyForLeave_Success() {
        LeaveApplicationRequestDTO request = new LeaveApplicationRequestDTO();
        request.setLeaveType(LeaveType.CASUAL);
        request.setStartDate(LocalDate.now().plusDays(5));
        request.setEndDate(LocalDate.now().plusDays(6));
        request.setReason("Family event");

        when(employeeRepository.findByUserUsername("john_doe")).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.findOverlappingLeaves(eq(10L), any(), any())).thenReturn(List.of());
        when(leaveBalanceRepository.findByEmployeeIdAndYear(eq(10L), anyInt())).thenReturn(Optional.of(leaveBalance));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(invocation -> {
            LeaveRequest lr = invocation.getArgument(0);
            lr.setId(100L);
            return lr;
        });

        LeaveResponseDTO response = leaveService.applyForLeave("john_doe", request);

        assertNotNull(response);
        assertEquals(LeaveStatus.PENDING, response.getStatus());
        assertEquals(2, response.getTotalDays());
        verify(leaveRequestRepository, times(1)).save(any(LeaveRequest.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when leave balance is insufficient")
    void testApplyForLeave_InsufficientBalance() {
        LeaveApplicationRequestDTO request = new LeaveApplicationRequestDTO();
        request.setLeaveType(LeaveType.CASUAL);
        request.setStartDate(LocalDate.now().plusDays(1));
        request.setEndDate(LocalDate.now().plusDays(10)); // 10 days requested, only 5 available
        request.setReason("Vacation");

        when(employeeRepository.findByUserUsername("john_doe")).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.findOverlappingLeaves(eq(10L), any(), any())).thenReturn(List.of());
        when(leaveBalanceRepository.findByEmployeeIdAndYear(eq(10L), anyInt())).thenReturn(Optional.of(leaveBalance));

        assertThrows(BadRequestException.class, () -> leaveService.applyForLeave("john_doe", request));
    }

    @Test
    @DisplayName("Should prevent overlapping leave requests")
    void testApplyForLeave_OverlappingLeave() {
        LeaveApplicationRequestDTO request = new LeaveApplicationRequestDTO();
        request.setLeaveType(LeaveType.SICK);
        request.setStartDate(LocalDate.now().plusDays(2));
        request.setEndDate(LocalDate.now().plusDays(3));
        request.setReason("Doctor appointment");

        LeaveRequest existing = new LeaveRequest();
        existing.setId(50L);

        when(employeeRepository.findByUserUsername("john_doe")).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.findOverlappingLeaves(eq(10L), any(), any())).thenReturn(List.of(existing));

        assertThrows(BadRequestException.class, () -> leaveService.applyForLeave("john_doe", request));
    }

    @Test
    @DisplayName("Should prevent an employee from approving their own leave")
    void testReviewLeave_SelfApprovalPrevention() {
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setId(100L);
        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus(LeaveStatus.PENDING);

        when(leaveRequestRepository.findById(100L)).thenReturn(Optional.of(leaveRequest));
        when(employeeRepository.findByUserUsername("john_doe")).thenReturn(Optional.of(employee));

        LeaveApprovalRequestDTO approval = new LeaveApprovalRequestDTO(LeaveStatus.APPROVED, "Self approve");

        assertThrows(BadRequestException.class, () -> leaveService.reviewLeave(100L, "john_doe", approval));
    }

    @Test
    @DisplayName("Manager should successfully approve leave and deduct balance")
    void testReviewLeave_ManagerApprovalSuccess() {
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setId(100L);
        leaveRequest.setEmployee(employee);
        leaveRequest.setLeaveType(LeaveType.CASUAL);
        leaveRequest.setStartDate(LocalDate.now().plusDays(5));
        leaveRequest.setEndDate(LocalDate.now().plusDays(6));
        leaveRequest.setTotalDays(2);
        leaveRequest.setStatus(LeaveStatus.PENDING);

        when(leaveRequestRepository.findById(100L)).thenReturn(Optional.of(leaveRequest));
        when(employeeRepository.findByUserUsername("sarah_mgr")).thenReturn(Optional.of(manager));
        when(leaveBalanceRepository.findByEmployeeIdAndYear(eq(10L), anyInt())).thenReturn(Optional.of(leaveBalance));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(inv -> inv.getArgument(0));

        LeaveApprovalRequestDTO approval = new LeaveApprovalRequestDTO(LeaveStatus.APPROVED, "Approved, take care");
        LeaveResponseDTO result = leaveService.reviewLeave(100L, "sarah_mgr", approval);

        assertEquals(LeaveStatus.APPROVED, result.getStatus());
        assertEquals(3, leaveBalance.getCasualLeaveBalance()); // 5 - 2 = 3
        verify(leaveBalanceRepository, times(1)).save(leaveBalance);
    }
}
