package com.ems.entity;

import jakarta.persistence.*;

/**
 * LeaveBalance Entity.
 * Tracks allocated and remaining leave balances per employee per calendar year.
 */
@Entity
@Table(name = "leave_balances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "year"})
})
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "casual_leave_balance", nullable = false)
    private Integer casualLeaveBalance = 12;

    @Column(name = "sick_leave_balance", nullable = false)
    private Integer sickLeaveBalance = 10;

    @Column(name = "earned_leave_balance", nullable = false)
    private Integer earnedLeaveBalance = 15;

    @Column(name = "unpaid_leave_used", nullable = false)
    private Integer unpaidLeaveUsed = 0;

    public LeaveBalance() {
    }

    public LeaveBalance(Employee employee, Integer year) {
        this.employee = employee;
        this.year = year;
        this.casualLeaveBalance = 12;
        this.sickLeaveBalance = 10;
        this.earnedLeaveBalance = 15;
        this.unpaidLeaveUsed = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
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
