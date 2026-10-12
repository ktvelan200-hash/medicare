package com.medicare.service.impl;

import com.medicare.dto.JwtAuthResponse;
import com.medicare.dto.LoginRequest;
import com.medicare.dto.RegisterRequest;
import com.medicare.dto.UserDto;
import com.medicare.entity.*;
import com.medicare.exception.BadRequestException;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.PatientRepository;
import com.medicare.repository.UserRepository;
import com.medicare.security.JwtTokenProvider;
import com.medicare.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public JwtAuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", loginRequest.getEmail()));

        if (!user.isEnabled()) {
            throw new BadRequestException("Your account is disabled. Please contact system administrator.");
        }

        Long roleSpecificId = null;
        if (user.getRole() == Role.ROLE_PATIENT) {
            Optional<Patient> patient = patientRepository.findByUserId(user.getId());
            if (patient.isPresent()) roleSpecificId = patient.get().getId();
        } else if (user.getRole() == Role.ROLE_DOCTOR) {
            Optional<Doctor> doctor = doctorRepository.findByUserId(user.getId());
            if (doctor.isPresent()) roleSpecificId = doctor.get().getId();
        }

        return new JwtAuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), roleSpecificId);
    }

    @Override
    @Transactional
    public JwtAuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already registered! Please log in.");
        }

        Role role = registerRequest.getRole() != null ? registerRequest.getRole() : Role.ROLE_PATIENT;
        if (role == Role.ROLE_ADMIN) {
            throw new BadRequestException("Admin registration is restricted.");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());
        user.setRole(role);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        Long roleSpecificId = null;

        if (role == Role.ROLE_PATIENT) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setGender(registerRequest.getGender());
            if (registerRequest.getDateOfBirth() != null && !registerRequest.getDateOfBirth().isEmpty()) {
                patient.setDateOfBirth(LocalDate.parse(registerRequest.getDateOfBirth()));
            }
            patient.setBloodGroup(registerRequest.getBloodGroup());
            patient.setAddress(registerRequest.getAddress());
            patient.setEmergencyContact(registerRequest.getEmergencyContact());
            patient.setMedicalHistory(registerRequest.getMedicalHistory());
            Patient savedPatient = patientRepository.save(patient);
            roleSpecificId = (savedPatient != null) ? savedPatient.getId() : null;
        } else if (role == Role.ROLE_DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setSpecialization(registerRequest.getSpecialization() != null ? registerRequest.getSpecialization() : "General Physician");
            doctor.setQualification(registerRequest.getQualification() != null ? registerRequest.getQualification() : "MBBS");
            doctor.setExperienceYears(registerRequest.getExperienceYears() != null ? registerRequest.getExperienceYears() : 1);
            doctor.setConsultationFee(registerRequest.getConsultationFee() != null ? registerRequest.getConsultationFee() : 500.0);
            doctor.setBio(registerRequest.getBio());
            doctor.setStatus(DoctorStatus.PENDING); // Requires admin approval before becoming active
            Doctor savedDoctor = doctorRepository.save(doctor);
            roleSpecificId = (savedDoctor != null) ? savedDoctor.getId() : null;
        }

        // Auto authenticate after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new JwtAuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), roleSpecificId);
    }

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return modelMapper.mapToUserDto(user);
    }
}
