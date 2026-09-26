package com.medicare.repository;

import com.medicare.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientIdOrderByIssuedDateDesc(Long patientId);
    List<Prescription> findByDoctorIdOrderByIssuedDateDesc(Long doctorId);
    Optional<Prescription> findByAppointmentId(Long appointmentId);
}
