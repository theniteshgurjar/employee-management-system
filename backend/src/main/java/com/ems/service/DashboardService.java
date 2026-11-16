package com.ems.service;

import com.ems.dto.DashboardStatsDTO;
import com.ems.enums.AttendanceStatus;
import com.ems.enums.EmploymentStatus;
import com.ems.enums.LeaveStatus;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long totalEmployees = employeeRepository.count();
        long totalDepartments = departmentRepository.count();

        LocalDate today = LocalDate.now();
        long presentToday = attendanceRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.PRESENT);
        long onLeaveToday = attendanceRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.ON_LEAVE);
        long absentToday = Math.max(0, totalEmployees - (presentToday + onLeaveToday));

        long pendingLeaves = leaveRequestRepository.countByStatus(LeaveStatus.PENDING);
        long approvedLeaves = leaveRequestRepository.countByStatus(LeaveStatus.APPROVED);

        return new DashboardStatsDTO(
                totalEmployees,
                totalDepartments,
                presentToday,
                absentToday,
                pendingLeaves,
                approvedLeaves
        );
    }
}
