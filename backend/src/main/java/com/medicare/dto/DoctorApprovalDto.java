package com.medicare.dto;

import com.medicare.entity.DoctorStatus;
import jakarta.validation.constraints.NotNull;

public class DoctorApprovalDto {

    @NotNull(message = "Doctor status is required")
    private DoctorStatus status; // APPROVED or REJECTED

    private String rejectionReason; // Required when status = REJECTED

    public DoctorApprovalDto() {}

    public DoctorApprovalDto(DoctorStatus status) {
        this.status = status;
    }

    public DoctorApprovalDto(DoctorStatus status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public DoctorStatus getStatus() { return status; }
    public void setStatus(DoctorStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
