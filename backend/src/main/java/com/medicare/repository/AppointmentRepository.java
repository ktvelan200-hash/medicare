package com.medicare.repository;

import com.medicare.entity.Appointment;
import com.medicare.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDescTimeSlotAsc(Long patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDescTimeSlotAsc(Long doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);
    List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);

    boolean existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusIn(
            Long doctorId, LocalDate appointmentDate, String timeSlot, List<AppointmentStatus> statuses);

    long countByStatus(AppointmentStatus status);

    @Query("SELECT COUNT(DISTINCT a.patient.id) FROM Appointment a WHERE a.doctor.id = :doctorId")
    long countDistinctPatientsByDoctorId(@Param("doctorId") Long doctorId);

    List<Appointment> findAllByOrderByCreatedAtDesc();

    // Used by the appointment reminder scheduler
    List<Appointment> findByAppointmentDateAndStatusIn(LocalDate date, List<AppointmentStatus> statuses);
}
