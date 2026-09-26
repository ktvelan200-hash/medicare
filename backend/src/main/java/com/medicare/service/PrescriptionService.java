package com.medicare.service;

import com.medicare.dto.PrescriptionDto;
import com.medicare.dto.PrescriptionRequestDto;

import java.util.List;

public interface PrescriptionService {
    PrescriptionDto createPrescription(String doctorEmail, PrescriptionRequestDto request);
    List<PrescriptionDto> getPatientPrescriptions(String patientEmail);
    List<PrescriptionDto> getDoctorPrescriptions(String doctorEmail);
    PrescriptionDto getPrescriptionByAppointmentId(Long appointmentId);
}
