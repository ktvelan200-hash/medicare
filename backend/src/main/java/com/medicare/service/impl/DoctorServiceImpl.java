package com.medicare.service.impl;

import com.medicare.dto.DoctorDto;
import com.medicare.entity.Doctor;
import com.medicare.entity.DoctorStatus;
import com.medicare.entity.User;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.UserRepository;
import com.medicare.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<DoctorDto> getAllApprovedDoctors(String specialization, String query) {
        List<Doctor> doctors;
        if (query != null && !query.trim().isEmpty()) {
            doctors = doctorRepository.searchDoctors(query.trim(), DoctorStatus.APPROVED);
        } else if (specialization != null && !specialization.trim().isEmpty() && !"all".equalsIgnoreCase(specialization)) {
            doctors = doctorRepository.findBySpecializationContainingIgnoreCaseAndStatus(specialization.trim(), DoctorStatus.APPROVED);
        } else {
            doctors = doctorRepository.findByStatus(DoctorStatus.APPROVED);
        }
        return doctors.stream().map(modelMapper::mapToDoctorDto).collect(Collectors.toList());
    }

    @Override
    public List<DoctorDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(modelMapper::mapToDoctorDto)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDto getDoctorById(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
        return modelMapper.mapToDoctorDto(doctor);
    }

    @Override
    public DoctorDto getDoctorByEmail(String email) {
        Doctor doctor = doctorRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", email));
        return modelMapper.mapToDoctorDto(doctor);
    }

    @Override
    @Transactional
    public DoctorDto updateDoctorProfile(String email, DoctorDto dto) {
        Doctor doctor = doctorRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", email));

        User user = doctor.getUser();
        if (dto.getUser() != null) {
            if (dto.getUser().getFullName() != null) user.setFullName(dto.getUser().getFullName());
            if (dto.getUser().getPhone() != null) user.setPhone(dto.getUser().getPhone());
            userRepository.save(user);
        }

        if (dto.getSpecialization() != null) doctor.setSpecialization(dto.getSpecialization());
        if (dto.getQualification() != null) doctor.setQualification(dto.getQualification());
        if (dto.getExperienceYears() != null) doctor.setExperienceYears(dto.getExperienceYears());
        if (dto.getConsultationFee() != null) doctor.setConsultationFee(dto.getConsultationFee());
        if (dto.getBio() != null) doctor.setBio(dto.getBio());

        Doctor saved = doctorRepository.save(doctor);
        return modelMapper.mapToDoctorDto(saved);
    }

    @Override
    @Transactional
    public DoctorDto updateDoctorStatus(Long doctorId, DoctorStatus status) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
        doctor.setStatus(status);
        Doctor updated = doctorRepository.save(doctor);
        return modelMapper.mapToDoctorDto(updated);
    }

    @Override
    public List<DoctorDto> getPendingDoctors() {
        return doctorRepository.findByStatus(DoctorStatus.PENDING).stream()
                .map(modelMapper::mapToDoctorDto)
                .collect(Collectors.toList());
    }
}
