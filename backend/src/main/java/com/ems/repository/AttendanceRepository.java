package com.ems.repository;

import com.ems.entity.Attendance;
import com.ems.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate attendanceDate);
    List<Attendance> findByEmployeeIdOrderByAttendanceDateDesc(Long employeeId);
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    Long countByAttendanceDateAndStatus(LocalDate attendanceDate, AttendanceStatus status);
}
