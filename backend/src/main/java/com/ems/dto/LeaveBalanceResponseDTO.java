package com.ems.dto;

public class LeaveBalanceResponseDTO {
    private Long id;
    private Long employeeId;
    private Integer year;
    private Integer casualLeaveBalance;
    private Integer sickLeaveBalance;
    private Integer earnedLeaveBalance;
    private Integer unpaidLeaveUsed;

    public LeaveBalanceResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getCasualLeaveBalance() {
        return casualLeaveBalance;
    }

    public void setCasualLeaveBalance(Integer casualLeaveBalance) {
        this.casualLeaveBalance = casualLeaveBalance;
    }

    public Integer getSickLeaveBalance() {
        return sickLeaveBalance;
    }

    public void setSickLeaveBalance(Integer sickLeaveBalance) {
        this.sickLeaveBalance = sickLeaveBalance;
    }

    public Integer getEarnedLeaveBalance() {
        return earnedLeaveBalance;
    }

    public void setEarnedLeaveBalance(Integer earnedLeaveBalance) {
        this.earnedLeaveBalance = earnedLeaveBalance;
    }

    public Integer getUnpaidLeaveUsed() {
        return unpaidLeaveUsed;
    }

    public void setUnpaidLeaveUsed(Integer unpaidLeaveUsed) {
        this.unpaidLeaveUsed = unpaidLeaveUsed;
    }
}
