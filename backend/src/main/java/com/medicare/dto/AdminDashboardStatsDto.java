package com.medicare.dto;

public class AdminDashboardStatsDto {
    private long totalPatients;
    private long totalDoctors;
    private long pendingDoctorApprovals;
    private long totalAppointments;
    private long completedAppointments;
    private long pendingAppointments;
    private long cancelledAppointments;

    public AdminDashboardStatsDto() {}

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }

    public long getPendingDoctorApprovals() { return pendingDoctorApprovals; }
    public void setPendingDoctorApprovals(long pendingDoctorApprovals) { this.pendingDoctorApprovals = pendingDoctorApprovals; }

    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }

    public long getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(long completedAppointments) { this.completedAppointments = completedAppointments; }

    public long getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(long pendingAppointments) { this.pendingAppointments = pendingAppointments; }

    public long getCancelledAppointments() { return cancelledAppointments; }
    public void setCancelledAppointments(long cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }
}
