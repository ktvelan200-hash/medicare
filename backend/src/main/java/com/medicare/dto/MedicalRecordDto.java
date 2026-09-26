package com.medicare.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MedicalRecordDto {
    private Long id;
    private PatientProfileDto patient;
    private DoctorDto doctor;
    private String title;
    private String recordType;
    private String fileUrl;
    private String notes;
    private LocalDate recordDate;
    private LocalDateTime createdAt;

    public MedicalRecordDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PatientProfileDto getPatient() { return patient; }
    public void setPatient(PatientProfileDto patient) { this.patient = patient; }

    public DoctorDto getDoctor() { return doctor; }
    public void setDoctor(DoctorDto doctor) { this.doctor = doctor; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRecordType() { return recordType; }
    public void setRecordType(String recordType) { this.recordType = recordType; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
