package com.medicare.service;

import com.medicare.dto.DoctorDto;
import com.medicare.entity.DoctorStatus;

import java.util.List;

public interface DoctorService {
    List<DoctorDto> getAllApprovedDoctors(String specialization, String query);
    List<DoctorDto> getAllDoctors();
    DoctorDto getDoctorById(Long doctorId);
    DoctorDto getDoctorByEmail(String email);
    DoctorDto updateDoctorProfile(String email, DoctorDto dto);
    DoctorDto updateDoctorStatus(Long doctorId, DoctorStatus status);
    List<DoctorDto> getPendingDoctors();
}
