package com.medicare;

import com.medicare.dto.JwtAuthResponse;
import com.medicare.dto.LoginRequest;
import com.medicare.dto.RegisterRequest;
import com.medicare.entity.Patient;
import com.medicare.entity.Role;
import com.medicare.entity.User;
import com.medicare.exception.BadRequestException;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.PatientRepository;
import com.medicare.repository.UserRepository;
import com.medicare.security.JwtTokenProvider;
import com.medicare.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User(1L, "test@medicare.com", "encodedPassword", "Test User", "+12345678", Role.ROLE_PATIENT, true);
    }

    @Test
    void testLoginSuccess() {
        LoginRequest loginRequest = new LoginRequest("test@medicare.com", "password123");
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mocked-jwt-token");
        when(userRepository.findByEmail("test@medicare.com")).thenReturn(Optional.of(sampleUser));

        JwtAuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.getAccessToken());
        assertEquals("test@medicare.com", response.getEmail());
    }

    @Test
    void testRegisterPatientSuccess() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("newpatient@medicare.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("New Patient");
        registerRequest.setRole(Role.ROLE_PATIENT);

        when(userRepository.existsByEmail("newpatient@medicare.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        Patient mockPatient = new Patient();
        mockPatient.setId(10L);
        when(patientRepository.save(any(Patient.class))).thenReturn(mockPatient);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mocked-jwt-token");

        JwtAuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.getAccessToken());
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@medicare.com");
        registerRequest.setPassword("password123");

        when(userRepository.existsByEmail("test@medicare.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
    }
}
