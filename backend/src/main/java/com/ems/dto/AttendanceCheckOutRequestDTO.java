package com.ems.dto;

public class AttendanceCheckOutRequestDTO {
    private String remarks;

    public AttendanceCheckOutRequestDTO() {
    }

    public AttendanceCheckOutRequestDTO(String remarks) {
        this.remarks = remarks;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
