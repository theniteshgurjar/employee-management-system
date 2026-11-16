package com.ems.service;

import com.ems.dto.AttendanceCheckInRequestDTO;
import com.ems.dto.AttendanceCheckOutRequestDTO;
import com.ems.dto.AttendanceResponseDTO;
import com.ems.entity.Attendance;
import com.ems.entity.Employee;
import com.ems.enums.AttendanceStatus;
import com.ems.exception.BadRequestException;
import com.ems.exception.DuplicateResourceException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public AttendanceResponseDTO checkIn(String username, AttendanceCheckInRequestDTO dto) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("No employee profile found for user: " + username));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), today);
        if (existing.isPresent()) {
            throw new DuplicateResourceException("You have already checked in today at " + existing.get().getCheckInTime());
        }

        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.SECONDS);
        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setAttendanceDate(today);
        attendance.setCheckInTime(now);
        attendance.setStatus(AttendanceStatus.PRESENT);
        if (dto != null && dto.getRemarks() != null) {
            attendance.setRemarks(dto.getRemarks().trim());
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToResponse(saved);
    }

    @Transactional
    public AttendanceResponseDTO checkOut(String username, AttendanceCheckOutRequestDTO dto) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("No employee profile found for user: " + username));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), today)
                .orElseThrow(() -> new BadRequestException("You have not checked in today yet. Check in first."));

        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException("You have already checked out today at " + attendance.getCheckOutTime());
        }

        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.SECONDS);
        attendance.setCheckOutTime(now);

        Duration duration = Duration.between(attendance.getCheckInTime(), now);
        double hours = (double) duration.toMinutes() / 60.0;
        attendance.setWorkingHours(Math.round(hours * 100.0) / 100.0);

        if (attendance.getWorkingHours() < 4.0) {
            attendance.setStatus(AttendanceStatus.HALF_DAY);
        }

        if (dto != null && dto.getRemarks() != null && !dto.getRemarks().trim().isEmpty()) {
            String combined = (attendance.getRemarks() != null ? attendance.getRemarks() + " | " : "") + dto.getRemarks().trim();
            attendance.setRemarks(combined);
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public AttendanceResponseDTO getTodayAttendance(String username) {
        Employee employee = employeeRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("No employee profile found for user: " + username));

        return attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), LocalDate.now())
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponseDTO> getEmployeeAttendanceHistory(Long employeeId) {
        return attendanceRepository.findByEmployeeIdOrderByAttendanceDateDesc(employeeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponseDTO> getAllAttendanceByDate(LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return attendanceRepository.findByAttendanceDate(targetDate).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AttendanceResponseDTO mapToResponse(Attendance att) {
        AttendanceResponseDTO dto = new AttendanceResponseDTO();
        dto.setId(att.getId());
        dto.setEmployeeId(att.getEmployee().getId());
        dto.setEmployeeName(att.getEmployee().getFirstName() + " " + att.getEmployee().getLastName());
        dto.setEmployeeCode(att.getEmployee().getEmployeeCode());
        dto.setAttendanceDate(att.getAttendanceDate());
        dto.setCheckInTime(att.getCheckInTime());
        dto.setCheckOutTime(att.getCheckOutTime());
        dto.setWorkingHours(att.getWorkingHours());
        dto.setStatus(att.getStatus());
        dto.setRemarks(att.getRemarks());
        return dto;
    }
}
