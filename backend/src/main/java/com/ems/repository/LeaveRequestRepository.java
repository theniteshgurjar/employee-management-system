package com.ems.repository;

import com.ems.entity.LeaveRequest;
import com.ems.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<LeaveRequest> findByEmployeeManagerIdOrderByCreatedAtDesc(Long managerId);
    List<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveStatus status);
    Long countByStatus(LeaveStatus status);

    /**
     * Query to detect overlapping leave requests for an employee.
     * Prevents submitting multiple leaves covering the same dates.
     */
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.id = :employeeId " +
           "AND lr.status IN (com.ems.enums.LeaveStatus.PENDING, com.ems.enums.LeaveStatus.APPROVED) " +
           "AND (:startDate <= lr.endDate AND :endDate >= lr.startDate)")
    List<LeaveRequest> findOverlappingLeaves(
        @Param("employeeId") Long employeeId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
