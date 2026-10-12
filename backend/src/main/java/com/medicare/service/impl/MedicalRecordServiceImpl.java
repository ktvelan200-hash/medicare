package com.medicare.service.impl;

import com.medicare.dto.MedicalRecordDto;
import com.medicare.entity.Doctor;
import com.medicare.entity.MedicalRecord;
import com.medicare.entity.Patient;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.MedicalRecordRepository;
import com.medicare.repository.PatientRepository;
import com.medicare.repository.UserRepository;
import com.medicare.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public MedicalRecordDto addMedicalRecord(String userEmail, MedicalRecordDto recordDto) {
        userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Patient patient;
        Doctor doctor = null;

        if (recordDto.getPatient() != null && recordDto.getPatient().getId() != null) {
            patient = patientRepository.findById(recordDto.getPatient().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", recordDto.getPatient().getId()));
        } else {
            patient = patientRepository.findByUserEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", userEmail));
        }

        Optional<Doctor> doctorOpt = doctorRepository.findByUserEmail(userEmail);
        if (doctorOpt.isPresent()) {
            doctor = doctorOpt.get();
        }

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setTitle(recordDto.getTitle());
        record.setRecordType(recordDto.getRecordType());
        record.setFileUrl(recordDto.getFileUrl());
        record.setNotes(recordDto.getNotes());
        record.setRecordDate(recordDto.getRecordDate() != null ? recordDto.getRecordDate() : LocalDate.now());

        MedicalRecord saved = medicalRecordRepository.save(record);
        return modelMapper.mapToMedicalRecordDto(saved);
    }

    @Override
    public List<MedicalRecordDto> getPatientMedicalRecords(String patientEmail) {
        Patient patient = patientRepository.findByUserEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", patientEmail));
        return medicalRecordRepository.findByPatientIdOrderByRecordDateDesc(patient.getId()).stream()
                .map(modelMapper::mapToMedicalRecordDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalRecordDto> getDoctorMedicalRecords(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", doctorEmail));
        return medicalRecordRepository.findByDoctorIdOrderByRecordDateDesc(doctor.getId()).stream()
                .map(modelMapper::mapToMedicalRecordDto)
                .collect(Collectors.toList());
    }
}
