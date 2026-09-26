package com.medicare;

import com.medicare.dto.AdminDashboardStatsDto;
import com.medicare.entity.AppointmentStatus;
import com.medicare.entity.DoctorStatus;
import com.medicare.repository.AppointmentRepository;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.PatientRepository;
import com.medicare.service.impl.AdminServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    void testGetDashboardStats() {
        when(patientRepository.count()).thenReturn(15L);
        when(doctorRepository.count()).thenReturn(5L);
        when(doctorRepository.countByStatus(DoctorStatus.PENDING)).thenReturn(1L);
        when(appointmentRepository.count()).thenReturn(20L);
        when(appointmentRepository.countByStatus(AppointmentStatus.COMPLETED)).thenReturn(10L);
        when(appointmentRepository.countByStatus(AppointmentStatus.PENDING)).thenReturn(5L);
        when(appointmentRepository.countByStatus(AppointmentStatus.CANCELLED)).thenReturn(2L);

        AdminDashboardStatsDto stats = adminService.getDashboardStats();

        assertNotNull(stats);
        assertEquals(15L, stats.getTotalPatients());
        assertEquals(5L, stats.getTotalDoctors());
        assertEquals(1L, stats.getPendingDoctorApprovals());
        assertEquals(20L, stats.getTotalAppointments());
        assertEquals(10L, stats.getCompletedAppointments());
    }
}
