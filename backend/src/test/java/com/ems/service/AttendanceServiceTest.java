package com.ems.service;

import com.ems.dto.AttendanceCheckInRequestDTO;
import com.ems.dto.AttendanceCheckOutRequestDTO;
import com.ems.dto.AttendanceResponseDTO;
import com.ems.entity.Attendance;
import com.ems.entity.Employee;
import com.ems.enums.AttendanceStatus;
import com.ems.exception.BadRequestException;
import com.ems.exception.DuplicateResourceException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    private Employee employee;

    @BeforeEach
    void setUp() {
        employee = new Employee();
        employee.setId(1L);
        employee.setEmployeeCode("EMP001");
        employee.setFirstName("Alice");
        employee.setLastName("Smith");
    }

    @Test
    @DisplayName("Should successfully check in when no prior record for today exists")
    void testCheckIn_Success() {
        when(employeeRepository.findByUserUsername("alice")).thenReturn(Optional.of(employee));
        when(attendanceRepository.findByEmployeeIdAndAttendanceDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.empty());
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(inv -> {
            Attendance a = inv.getArgument(0);
            a.setId(10L);
            return a;
        });

        AttendanceResponseDTO result = attendanceService.checkIn("alice", new AttendanceCheckInRequestDTO("Working from office"));

        assertNotNull(result);
        assertEquals(AttendanceStatus.PRESENT, result.getStatus());
        assertNotNull(result.getCheckInTime());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException on duplicate check-in")
    void testCheckIn_DuplicatePrevention() {
        Attendance existing = new Attendance();
        existing.setId(10L);
        existing.setCheckInTime(LocalTime.of(9, 0));

        when(employeeRepository.findByUserUsername("alice")).thenReturn(Optional.of(employee));
        when(attendanceRepository.findByEmployeeIdAndAttendanceDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.of(existing));

        assertThrows(DuplicateResourceException.class, () ->
                attendanceService.checkIn("alice", new AttendanceCheckInRequestDTO("Check in again")));
    }

    @Test
    @DisplayName("Should check out and compute working hours properly")
    void testCheckOut_Success() {
        Attendance attendance = new Attendance();
        attendance.setId(10L);
        attendance.setEmployee(employee);
        attendance.setAttendanceDate(LocalDate.now());
        attendance.setCheckInTime(LocalTime.now().minusHours(8));

        when(employeeRepository.findByUserUsername("alice")).thenReturn(Optional.of(employee));
        when(attendanceRepository.findByEmployeeIdAndAttendanceDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.of(attendance));
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(inv -> inv.getArgument(0));

        AttendanceResponseDTO result = attendanceService.checkOut("alice", new AttendanceCheckOutRequestDTO("Finished work"));

        assertNotNull(result.getCheckOutTime());
        assertNotNull(result.getWorkingHours());
        assertTrue(result.getWorkingHours() >= 7.9);
    }
}
