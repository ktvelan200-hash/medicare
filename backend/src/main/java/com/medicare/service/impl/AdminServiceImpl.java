package com.medicare.service.impl;

import com.medicare.dto.AdminDashboardStatsDto;
import com.medicare.entity.AppointmentStatus;
import com.medicare.entity.DoctorStatus;
import com.medicare.repository.AppointmentRepository;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.PatientRepository;
import com.medicare.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public AdminDashboardStatsDto getDashboardStats() {
        AdminDashboardStatsDto stats = new AdminDashboardStatsDto();
        stats.setTotalPatients(patientRepository.count());
        stats.setTotalDoctors(doctorRepository.count());
        stats.setPendingDoctorApprovals(doctorRepository.countByStatus(DoctorStatus.PENDING));
        stats.setTotalAppointments(appointmentRepository.count());
        stats.setCompletedAppointments(appointmentRepository.countByStatus(AppointmentStatus.COMPLETED));
        stats.setPendingAppointments(appointmentRepository.countByStatus(AppointmentStatus.PENDING));
        stats.setCancelledAppointments(appointmentRepository.countByStatus(AppointmentStatus.CANCELLED));
        return stats;
    }
}
