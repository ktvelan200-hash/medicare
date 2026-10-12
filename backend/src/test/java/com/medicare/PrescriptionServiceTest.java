package com.medicare;

import com.medicare.dto.PrescriptionDto;
import com.medicare.dto.PrescriptionRequestDto;
import com.medicare.entity.*;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.AppointmentRepository;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.PrescriptionRepository;
import com.medicare.service.NotificationService;
import com.medicare.service.impl.PrescriptionServiceImpl;
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
public class PrescriptionServiceTest {

    @Mock
    private PrescriptionRepository prescriptionRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private com.medicare.service.EmailService emailService;

    @Spy
    private ModelMapper modelMapper;

    @InjectMocks
    private PrescriptionServiceImpl prescriptionService;

    private Doctor sampleDoctor;
    private Patient samplePatient;
    private Appointment sampleAppointment;

    @BeforeEach
    void setUp() {
        User docUser = new User(1L, "doctor@medicare.com", "pass", "Dr. Smith", "+111", Role.ROLE_DOCTOR, true);
        sampleDoctor = new Doctor(docUser, "Cardiology", "MD", 10, 500.0, "Bio", DoctorStatus.APPROVED);
        sampleDoctor.setId(1L);

        User patUser = new User(2L, "patient@medicare.com", "pass", "John Patient", "+222", Role.ROLE_PATIENT, true);
        samplePatient = new Patient(patUser, "Male", LocalDate.of(1990, 1, 1), "O+", "Addr", "+222", "History");
        samplePatient.setId(2L);

        sampleAppointment = new Appointment(samplePatient, sampleDoctor, LocalDate.now(), "10:00", AppointmentStatus.CONFIRMED, "Reason");
        sampleAppointment.setId(5L);
    }

    @Test
    void testCreatePrescriptionSuccess() {
        PrescriptionRequestDto req = new PrescriptionRequestDto();
        req.setAppointmentId(5L);
        req.setDiagnosis("Hypertension");
        req.setMedicines("Amlodipine 5mg");

        when(doctorRepository.findByUserEmail("doctor@medicare.com")).thenReturn(Optional.of(sampleDoctor));
        when(appointmentRepository.findById(5L)).thenReturn(Optional.of(sampleAppointment));

        Prescription savedPres = new Prescription(sampleAppointment, sampleDoctor, samplePatient, req.getDiagnosis(), req.getMedicines(), "Take daily");
        savedPres.setId(10L);
        when(prescriptionRepository.save(any(Prescription.class))).thenReturn(savedPres);

        PrescriptionDto dto = prescriptionService.createPrescription("doctor@medicare.com", req);

        assertNotNull(dto);
        assertEquals("Hypertension", dto.getDiagnosis());
        assertEquals(AppointmentStatus.COMPLETED, sampleAppointment.getStatus());
    }
}
