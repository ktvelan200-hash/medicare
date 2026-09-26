package com.medicare.dto;

import com.medicare.entity.DoctorStatus;
import jakarta.validation.constraints.NotNull;

public class DoctorApprovalDto {

    @NotNull(message = "Doctor status is required")
    private DoctorStatus status; // APPROVED or REJECTED

    public DoctorApprovalDto() {}

    public DoctorApprovalDto(DoctorStatus status) {
        this.status = status;
    }

    public DoctorStatus getStatus() { return status; }
    public void setStatus(DoctorStatus status) { this.status = status; }
}
