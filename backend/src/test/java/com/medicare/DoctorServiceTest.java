package com.medicare;

import com.medicare.dto.DoctorDto;
import com.medicare.entity.Doctor;
import com.medicare.entity.DoctorStatus;
import com.medicare.entity.Role;
import com.medicare.entity.User;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.DoctorRepository;
import com.medicare.service.impl.DoctorServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @Spy
    private ModelMapper modelMapper;

    @InjectMocks
    private DoctorServiceImpl doctorService;

    private Doctor sampleDoctor;

    @BeforeEach
    void setUp() {
        User docUser = new User(2L, "doctor@medicare.com", "pass", "Dr. House", "+1111", Role.ROLE_DOCTOR, true);
        sampleDoctor = new Doctor(docUser, "Neurology", "MD", 10, 500.0, "Expert", DoctorStatus.APPROVED);
        sampleDoctor.setId(1L);
    }

    @Test
    void testGetAllApprovedDoctors() {
        when(doctorRepository.findByStatus(DoctorStatus.APPROVED)).thenReturn(List.of(sampleDoctor));

        List<DoctorDto> list = doctorService.getAllApprovedDoctors(null, null);

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("Neurology", list.get(0).getSpecialization());
    }

    @Test
    void testUpdateDoctorStatus() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(sampleDoctor));
        when(doctorRepository.save(any(Doctor.class))).thenReturn(sampleDoctor);

        DoctorDto updated = doctorService.updateDoctorStatus(1L, DoctorStatus.APPROVED);

        assertNotNull(updated);
        assertEquals(DoctorStatus.APPROVED, updated.getStatus());
        verify(doctorRepository, times(1)).save(sampleDoctor);
    }
}
