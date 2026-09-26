package com.medicare.repository;

import com.medicare.entity.Doctor;
import com.medicare.entity.DoctorStatus;
import com.medicare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(Long userId);
    Optional<Doctor> findByUserEmail(String email);

    List<Doctor> findByStatus(DoctorStatus status);
    List<Doctor> findBySpecializationContainingIgnoreCaseAndStatus(String specialization, DoctorStatus status);

    @Query("SELECT d FROM Doctor d WHERE d.status = :status AND " +
           "(LOWER(d.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.qualification) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Doctor> searchDoctors(@Param("query") String query, @Param("status") DoctorStatus status);

    long countByStatus(DoctorStatus status);
}
