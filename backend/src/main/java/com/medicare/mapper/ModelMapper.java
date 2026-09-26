package com.medicare.mapper;

import com.medicare.dto.*;
import com.medicare.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ModelMapper {

    public UserDto mapToUserDto(User user) {
        if (user == null) return null;
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt()
        );
    }

    public PatientProfileDto mapToPatientProfileDto(Patient patient) {
        if (patient == null) return null;
        PatientProfileDto dto = new PatientProfileDto();
        dto.setId(patient.getId());
        dto.setUser(mapToUserDto(patient.getUser()));
        dto.setGender(patient.getGender());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setBloodGroup(patient.getBloodGroup());
        dto.setAddress(patient.getAddress());
        dto.setEmergencyContact(patient.getEmergencyContact());
        dto.setMedicalHistory(patient.getMedicalHistory());
        return dto;
    }

    public DoctorDto mapToDoctorDto(Doctor doctor) {
        if (doctor == null) return null;
        DoctorDto dto = new DoctorDto();
        dto.setId(doctor.getId());
        dto.setUser(mapToUserDto(doctor.getUser()));
        dto.setSpecialization(doctor.getSpecialization());
        dto.setQualification(doctor.getQualification());
        dto.setExperienceYears(doctor.getExperienceYears());
        dto.setConsultationFee(doctor.getConsultationFee());
        dto.setBio(doctor.getBio());
        dto.setStatus(doctor.getStatus());
        dto.setCreatedAt(doctor.getCreatedAt());
        return dto;
    }

    public DoctorAvailabilityDto mapToDoctorAvailabilityDto(DoctorAvailability availability) {
        if (availability == null) return null;
        DoctorAvailabilityDto dto = new DoctorAvailabilityDto();
        dto.setId(availability.getId());
        dto.setDoctorId(availability.getDoctor().getId());
        dto.setDayOfWeek(availability.getDayOfWeek());
        dto.setStartTime(availability.getStartTime());
        dto.setEndTime(availability.getEndTime());
        dto.setMaxPatients(availability.getMaxPatients());
        dto.setSlotDurationMinutes(availability.getSlotDurationMinutes());
        return dto;
    }

    public AppointmentResponseDto mapToAppointmentResponseDto(Appointment appointment) {
        if (appointment == null) return null;
        AppointmentResponseDto dto = new AppointmentResponseDto();
        dto.setId(appointment.getId());
        dto.setPatient(mapToPatientProfileDto(appointment.getPatient()));
        dto.setDoctor(mapToDoctorDto(appointment.getDoctor()));
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setTimeSlot(appointment.getTimeSlot());
        dto.setStatus(appointment.getStatus());
        dto.setReason(appointment.getReason());
        dto.setConsultationNotes(appointment.getConsultationNotes());
        dto.setCreatedAt(appointment.getCreatedAt());
        dto.setUpdatedAt(appointment.getUpdatedAt());
        return dto;
    }

    public PrescriptionDto mapToPrescriptionDto(Prescription prescription) {
        if (prescription == null) return null;
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(prescription.getId());
        dto.setAppointmentId(prescription.getAppointment().getId());
        dto.setDoctor(mapToDoctorDto(prescription.getDoctor()));
        dto.setPatient(mapToPatientProfileDto(prescription.getPatient()));
        dto.setDiagnosis(prescription.getDiagnosis());
        dto.setMedicines(prescription.getMedicines());
        dto.setInstructions(prescription.getInstructions());
        dto.setIssuedDate(prescription.getIssuedDate());
        dto.setCreatedAt(prescription.getCreatedAt());
        return dto;
    }

    public MedicalRecordDto mapToMedicalRecordDto(MedicalRecord record) {
        if (record == null) return null;
        MedicalRecordDto dto = new MedicalRecordDto();
        dto.setId(record.getId());
        dto.setPatient(mapToPatientProfileDto(record.getPatient()));
        if (record.getDoctor() != null) {
            dto.setDoctor(mapToDoctorDto(record.getDoctor()));
        }
        dto.setTitle(record.getTitle());
        dto.setRecordType(record.getRecordType());
        dto.setFileUrl(record.getFileUrl());
        dto.setNotes(record.getNotes());
        dto.setRecordDate(record.getRecordDate());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }

    public NotificationDto mapToNotificationDto(Notification notification) {
        if (notification == null) return null;
        return new NotificationDto(
                notification.getId(),
                notification.getUser().getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
