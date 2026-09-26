package com.medicare.service;

import com.medicare.dto.PatientProfileDto;

import java.util.List;

public interface PatientService {
    PatientProfileDto getPatientProfile(Long patientId);
    PatientProfileDto getPatientByEmail(String email);
    PatientProfileDto updatePatientProfile(String email, PatientProfileDto dto);
    List<PatientProfileDto> getAllPatients();
}
