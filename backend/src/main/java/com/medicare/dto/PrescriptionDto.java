package com.medicare.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PrescriptionDto {
    private Long id;
    private Long appointmentId;
    private DoctorDto doctor;
    private PatientProfileDto patient;
    private String diagnosis;
    private String medicines;
    private String instructions;
    private LocalDate issuedDate;
    private LocalDateTime createdAt;

    public PrescriptionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public DoctorDto getDoctor() { return doctor; }
    public void setDoctor(DoctorDto doctor) { this.doctor = doctor; }

    public PatientProfileDto getPatient() { return patient; }
    public void setPatient(PatientProfileDto patient) { this.patient = patient; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getMedicines() { return medicines; }
    public void setMedicines(String medicines) { this.medicines = medicines; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public LocalDate getIssuedDate() { return issuedDate; }
    public void setIssuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
