package com.medicare.service.impl;

import com.medicare.dto.PrescriptionDto;
import com.medicare.dto.PrescriptionRequestDto;
import com.medicare.entity.*;
import com.medicare.exception.BadRequestException;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.AppointmentRepository;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.PatientRepository;
import com.medicare.repository.PrescriptionRepository;
import com.medicare.service.NotificationService;
import com.medicare.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public PrescriptionDto createPrescription(String doctorEmail, PrescriptionRequestDto request) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", doctorEmail));

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", request.getAppointmentId()));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("You are not authorized to create a prescription for this appointment.");
        }

        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setDoctor(doctor);
        prescription.setPatient(appointment.getPatient());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setMedicines(request.getMedicines());
        prescription.setInstructions(request.getInstructions());

        Prescription saved = prescriptionRepository.save(prescription);

        // Auto mark appointment as COMPLETED when prescription is issued
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        // Send notification to Patient
        notificationService.createNotification(
                appointment.getPatient().getUser(),
                "New Prescription Issued",
                "Dr. " + doctor.getUser().getFullName() + " has issued a new prescription for your appointment."
        );

        return modelMapper.mapToPrescriptionDto(saved);
    }

    @Override
    public List<PrescriptionDto> getPatientPrescriptions(String patientEmail) {
        Patient patient = patientRepository.findByUserEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", patientEmail));
        return prescriptionRepository.findByPatientIdOrderByIssuedDateDesc(patient.getId()).stream()
                .map(modelMapper::mapToPrescriptionDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionDto> getDoctorPrescriptions(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", doctorEmail));
        return prescriptionRepository.findByDoctorIdOrderByIssuedDateDesc(doctor.getId()).stream()
                .map(modelMapper::mapToPrescriptionDto)
                .collect(Collectors.toList());
    }

    @Override
    public PrescriptionDto getPrescriptionByAppointmentId(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "appointmentId", appointmentId));
        return modelMapper.mapToPrescriptionDto(prescription);
    }
}
