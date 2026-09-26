package com.medicare.dto;

import com.medicare.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public class AppointmentStatusUpdateDto {

    @NotNull(message = "Status cannot be null")
    private AppointmentStatus status;

    private String consultationNotes;

    public AppointmentStatusUpdateDto() {}

    public AppointmentStatusUpdateDto(AppointmentStatus status, String consultationNotes) {
        this.status = status;
        this.consultationNotes = consultationNotes;
    }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public String getConsultationNotes() { return consultationNotes; }
    public void setConsultationNotes(String consultationNotes) { this.consultationNotes = consultationNotes; }
}
