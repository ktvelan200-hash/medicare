package com.medicare.service;

import com.medicare.dto.AppointmentRequestDto;
import com.medicare.dto.AppointmentResponseDto;
import com.medicare.dto.AppointmentStatusUpdateDto;

import java.util.List;

public interface AppointmentService {
    AppointmentResponseDto bookAppointment(String patientEmail, AppointmentRequestDto request);
    List<AppointmentResponseDto> getPatientAppointments(String patientEmail);
    List<AppointmentResponseDto> getDoctorAppointments(String doctorEmail);
    List<AppointmentResponseDto> getAllAppointments();
    AppointmentResponseDto updateAppointmentStatus(Long appointmentId, String userEmail, AppointmentStatusUpdateDto updateDto);
    AppointmentResponseDto cancelAppointment(Long appointmentId, String patientEmail);
    AppointmentResponseDto getAppointmentById(Long appointmentId);
}
