package com.ems.entity;

import com.ems.enums.LeaveStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * LeaveApprovalHistory Entity.
 * Maintains an immutable audit log of all decisions (approval, rejection, cancellation)
 * performed on leave requests.
 */
@Entity
@Table(name = "leave_approval_history")
public class LeaveApprovalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "leave_request_id", nullable = false)
    private LeaveRequest leaveRequest;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "action_by_id", nullable = false)
    private Employee actionBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LeaveStatus action;

    @Column(length = 500)
    private String comments;

    @Column(name = "action_timestamp", nullable = false, updatable = false)
    private LocalDateTime actionTimestamp = LocalDateTime.now();

    public LeaveApprovalHistory() {
    }

    public LeaveApprovalHistory(LeaveRequest leaveRequest, Employee actionBy, LeaveStatus action, String comments) {
        this.leaveRequest = leaveRequest;
        this.actionBy = actionBy;
        this.action = action;
        this.comments = comments;
        this.actionTimestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LeaveRequest getLeaveRequest() {
        return leaveRequest;
    }

    public void setLeaveRequest(LeaveRequest leaveRequest) {
        this.leaveRequest = leaveRequest;
    }

    public Employee getActionBy() {
        return actionBy;
    }

    public void setActionBy(Employee actionBy) {
        this.actionBy = actionBy;
    }

    public LeaveStatus getAction() {
        return action;
    }

    public void setAction(LeaveStatus action) {
        this.action = action;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public LocalDateTime getActionTimestamp() {
        return actionTimestamp;
    }

    public void setActionTimestamp(LocalDateTime actionTimestamp) {
        this.actionTimestamp = actionTimestamp;
    }
}
