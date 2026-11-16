package com.ems.dto;

public class DashboardStatsDTO {
    private long totalEmployees;
    private long totalDepartments;
    private long presentToday;
    private long absentToday;
    private long pendingLeaves;
    private long approvedLeaves;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalEmployees, long totalDepartments, long presentToday,
                             long absentToday, long pendingLeaves, long approvedLeaves) {
        this.totalEmployees = totalEmployees;
        this.totalDepartments = totalDepartments;
        this.presentToday = presentToday;
        this.absentToday = absentToday;
        this.pendingLeaves = pendingLeaves;
        this.approvedLeaves = approvedLeaves;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public long getPresentToday() {
        return presentToday;
    }

    public void setPresentToday(long presentToday) {
        this.presentToday = presentToday;
    }

    public long getAbsentToday() {
        return absentToday;
    }

    public void setAbsentToday(long absentToday) {
        this.absentToday = absentToday;
    }

    public long getPendingLeaves() {
        return pendingLeaves;
    }

    public void setPendingLeaves(long pendingLeaves) {
        this.pendingLeaves = pendingLeaves;
    }

    public long getApprovedLeaves() {
        return approvedLeaves;
    }

    public void setApprovedLeaves(long approvedLeaves) {
        this.approvedLeaves = approvedLeaves;
    }
}
