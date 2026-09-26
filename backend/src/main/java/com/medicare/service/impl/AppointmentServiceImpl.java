package com.medicare.service.impl;

import com.medicare.dto.AppointmentRequestDto;
import com.medicare.dto.AppointmentResponseDto;
import com.medicare.dto.AppointmentStatusUpdateDto;
import com.medicare.entity.*;
import com.medicare.exception.BadRequestException;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.AppointmentRepository;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.PatientRepository;
import com.medicare.service.AppointmentService;
import com.medicare.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public AppointmentResponseDto bookAppointment(String patientEmail, AppointmentRequestDto request) {
        Patient patient = patientRepository.findByUserEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", patientEmail));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", request.getDoctorId()));

        if (doctor.getStatus() != DoctorStatus.APPROVED) {
            throw new BadRequestException("Doctor is currently not available for booking.");
        }

        // Prevent double booking of the same doctor & date & time slot
        List<AppointmentStatus> activeStatuses = Arrays.asList(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED);
        boolean isSlotTaken = appointmentRepository.existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusIn(
                doctor.getId(), request.getAppointmentDate(), request.getTimeSlot(), activeStatuses
        );

        if (isSlotTaken) {
            throw new BadRequestException("This doctor time slot (" + request.getTimeSlot() + " on " + request.getAppointmentDate() + ") is already booked! Please select another time slot.");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setTimeSlot(request.getTimeSlot());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setReason(request.getReason());

        Appointment saved = appointmentRepository.save(appointment);

        // Notify Doctor & Patient
        notificationService.createNotification(
                doctor.getUser(),
                "New Appointment Request",
                "Patient " + patient.getUser().getFullName() + " requested an appointment on " + saved.getAppointmentDate() + " at " + saved.getTimeSlot()
        );
        notificationService.createNotification(
                patient.getUser(),
                "Appointment Submitted",
                "Your appointment request with Dr. " + doctor.getUser().getFullName() + " is pending approval."
        );

        return modelMapper.mapToAppointmentResponseDto(saved);
    }

    @Override
    public List<AppointmentResponseDto> getPatientAppointments(String patientEmail) {
        Patient patient = patientRepository.findByUserEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", patientEmail));
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescTimeSlotAsc(patient.getId()).stream()
                .map(modelMapper::mapToAppointmentResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponseDto> getDoctorAppointments(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", doctorEmail));
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescTimeSlotAsc(doctor.getId()).stream()
                .map(modelMapper::mapToAppointmentResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponseDto> getAllAppointments() {
        return appointmentRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(modelMapper::mapToAppointmentResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentResponseDto updateAppointmentStatus(Long appointmentId, String userEmail, AppointmentStatusUpdateDto updateDto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        appointment.setStatus(updateDto.getStatus());
        if (updateDto.getConsultationNotes() != null) {
            appointment.setConsultationNotes(updateDto.getConsultationNotes());
        }

        Appointment updated = appointmentRepository.save(appointment);

        // Notify Patient
        notificationService.createNotification(
                appointment.getPatient().getUser(),
                "Appointment Update",
                "Your appointment with Dr. " + appointment.getDoctor().getUser().getFullName() + " has been updated to: " + updateDto.getStatus()
        );

        return modelMapper.mapToAppointmentResponseDto(updated);
    }

    @Override
    @Transactional
    public AppointmentResponseDto cancelAppointment(Long appointmentId, String patientEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        if (!appointment.getPatient().getUser().getEmail().equals(patientEmail)) {
            throw new BadRequestException("You are not authorized to cancel this appointment.");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Completed appointments cannot be cancelled.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment cancelled = appointmentRepository.save(appointment);

        notificationService.createNotification(
                appointment.getDoctor().getUser(),
                "Appointment Cancelled",
                "Patient " + appointment.getPatient().getUser().getFullName() + " cancelled the appointment on " + appointment.getAppointmentDate()
        );

        return modelMapper.mapToAppointmentResponseDto(cancelled);
    }

    @Override
    public AppointmentResponseDto getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));
        return modelMapper.mapToAppointmentResponseDto(appointment);
    }
}
