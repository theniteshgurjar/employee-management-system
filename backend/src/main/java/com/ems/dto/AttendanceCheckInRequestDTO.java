package com.ems.dto;

public class AttendanceCheckInRequestDTO {
    private String remarks;

    public AttendanceCheckInRequestDTO() {
    }

    public AttendanceCheckInRequestDTO(String remarks) {
        this.remarks = remarks;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
