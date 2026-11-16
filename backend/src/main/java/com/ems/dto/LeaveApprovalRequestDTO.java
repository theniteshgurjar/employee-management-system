package com.ems.dto;

import com.ems.enums.LeaveStatus;
import jakarta.validation.constraints.NotNull;

public class LeaveApprovalRequestDTO {

    @NotNull(message = "Decision status is required (APPROVED or REJECTED)")
    private LeaveStatus status;

    private String comments;

    public LeaveApprovalRequestDTO() {
    }

    public LeaveApprovalRequestDTO(LeaveStatus status, String comments) {
        this.status = status;
        this.comments = comments;
    }

    public LeaveStatus getStatus() {
        return status;
    }

    public void setStatus(LeaveStatus status) {
        this.status = status;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
