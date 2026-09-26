package com.medicare.service.impl;

import com.medicare.dto.PatientProfileDto;
import com.medicare.entity.Patient;
import com.medicare.entity.User;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.PatientRepository;
import com.medicare.repository.UserRepository;
import com.medicare.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public PatientProfileDto getPatientProfile(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));
        return modelMapper.mapToPatientProfileDto(patient);
    }

    @Override
    public PatientProfileDto getPatientByEmail(String email) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", email));
        return modelMapper.mapToPatientProfileDto(patient);
    }

    @Override
    @Transactional
    public PatientProfileDto updatePatientProfile(String email, PatientProfileDto dto) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", email));

        User user = patient.getUser();
        if (dto.getUser() != null) {
            if (dto.getUser().getFullName() != null) user.setFullName(dto.getUser().getFullName());
            if (dto.getUser().getPhone() != null) user.setPhone(dto.getUser().getPhone());
            userRepository.save(user);
        }

        if (dto.getGender() != null) patient.setGender(dto.getGender());
        if (dto.getDateOfBirth() != null) patient.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getBloodGroup() != null) patient.setBloodGroup(dto.getBloodGroup());
        if (dto.getAddress() != null) patient.setAddress(dto.getAddress());
        if (dto.getEmergencyContact() != null) patient.setEmergencyContact(dto.getEmergencyContact());
        if (dto.getMedicalHistory() != null) patient.setMedicalHistory(dto.getMedicalHistory());

        Patient saved = patientRepository.save(patient);
        return modelMapper.mapToPatientProfileDto(saved);
    }

    @Override
    public List<PatientProfileDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(modelMapper::mapToPatientProfileDto)
                .collect(Collectors.toList());
    }
}
