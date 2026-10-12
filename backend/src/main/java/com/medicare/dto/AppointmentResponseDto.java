package com.medicare.dto;

import com.medicare.entity.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AppointmentResponseDto {
    private Long id;
    private PatientProfileDto patient;
    private DoctorDto doctor;
    private LocalDate appointmentDate;
    private String timeSlot;
    private AppointmentStatus status;
    private String reason;
    private String consultationNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean hasReview;
    private Integer reviewRating;

    public AppointmentResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PatientProfileDto getPatient() { return patient; }
    public void setPatient(PatientProfileDto patient) { this.patient = patient; }

    public DoctorDto getDoctor() { return doctor; }
    public void setDoctor(DoctorDto doctor) { this.doctor = doctor; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getConsultationNotes() { return consultationNotes; }
    public void setConsultationNotes(String consultationNotes) { this.consultationNotes = consultationNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getHasReview() { return hasReview; }
    public void setHasReview(Boolean hasReview) { this.hasReview = hasReview; }

    public Integer getReviewRating() { return reviewRating; }
    public void setReviewRating(Integer reviewRating) { this.reviewRating = reviewRating; }
}
