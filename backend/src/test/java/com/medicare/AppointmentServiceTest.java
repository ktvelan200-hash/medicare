package com.medicare;

import com.medicare.dto.AppointmentRequestDto;
import com.medicare.dto.AppointmentResponseDto;
import com.medicare.entity.*;
import com.medicare.exception.BadRequestException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.AppointmentRepository;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.PatientRepository;
import com.medicare.service.NotificationService;
import com.medicare.service.impl.AppointmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private NotificationService notificationService;

    @Spy
    private ModelMapper modelMapper;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    private Patient samplePatient;
    private Doctor sampleDoctor;

    @BeforeEach
    void setUp() {
        User patUser = new User(1L, "patient@medicare.com", "pass", "John Patient", "+111", Role.ROLE_PATIENT, true);
        samplePatient = new Patient(patUser, "Male", LocalDate.of(1995, 1, 1), "O+", "Address", "+111", "None");
        samplePatient.setId(10L);

        User docUser = new User(2L, "doctor@medicare.com", "pass", "Dr. Smith", "+222", Role.ROLE_DOCTOR, true);
        sampleDoctor = new Doctor(docUser, "Cardiology", "MD", 10, 500.0, "Bio", DoctorStatus.APPROVED);
        sampleDoctor.setId(20L);
    }

    @Test
    void testBookAppointmentSuccess() {
        AppointmentRequestDto req = new AppointmentRequestDto();
        req.setDoctorId(20L);
        req.setAppointmentDate(LocalDate.now().plusDays(1));
        req.setTimeSlot("10:00 - 10:30");
        req.setReason("Routine Checkup");

        when(patientRepository.findByUserEmail("patient@medicare.com")).thenReturn(Optional.of(samplePatient));
        when(doctorRepository.findById(20L)).thenReturn(Optional.of(sampleDoctor));
        when(appointmentRepository.existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusIn(any(), any(), any(), any())).thenReturn(false);

        Appointment savedApp = new Appointment(samplePatient, sampleDoctor, req.getAppointmentDate(), req.getTimeSlot(), AppointmentStatus.PENDING, req.getReason());
        savedApp.setId(100L);
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(savedApp);

        AppointmentResponseDto response = appointmentService.bookAppointment("patient@medicare.com", req);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("10:00 - 10:30", response.getTimeSlot());
        assertEquals(AppointmentStatus.PENDING, response.getStatus());
    }

    @Test
    void testBookAppointmentDoubleBookingThrowsException() {
        AppointmentRequestDto req = new AppointmentRequestDto();
        req.setDoctorId(20L);
        req.setAppointmentDate(LocalDate.now().plusDays(1));
        req.setTimeSlot("10:00 - 10:30");

        when(patientRepository.findByUserEmail("patient@medicare.com")).thenReturn(Optional.of(samplePatient));
        when(doctorRepository.findById(20L)).thenReturn(Optional.of(sampleDoctor));
        when(appointmentRepository.existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusIn(any(), any(), any(), any())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> appointmentService.bookAppointment("patient@medicare.com", req));
    }
}
