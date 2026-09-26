package com.medicare.service;

import com.medicare.dto.MedicalRecordDto;

import java.util.List;

public interface MedicalRecordService {
    MedicalRecordDto addMedicalRecord(String userEmail, MedicalRecordDto recordDto);
    List<MedicalRecordDto> getPatientMedicalRecords(String patientEmail);
    List<MedicalRecordDto> getDoctorMedicalRecords(String doctorEmail);
}
