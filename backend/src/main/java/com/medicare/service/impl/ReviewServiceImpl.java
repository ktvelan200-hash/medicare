package com.medicare.service.impl;

import com.medicare.dto.DoctorRatingSummaryDto;
import com.medicare.dto.ReviewDto;
import com.medicare.dto.ReviewRequestDto;
import com.medicare.entity.*;
import com.medicare.exception.BadRequestException;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.repository.AppointmentRepository;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.PatientRepository;
import com.medicare.repository.ReviewRepository;
import com.medicare.service.NotificationService;
import com.medicare.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired(required = false)
    private NotificationService notificationService;

    @Override
    @Transactional
    public ReviewDto createReview(String patientEmail, ReviewRequestDto request) {
        Patient patient = patientRepository.findByUserEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", patientEmail));

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", request.getAppointmentId()));

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new BadRequestException("You can only submit reviews for your own appointments.");
        }

        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted after the appointment has been completed.");
        }

        if (reviewRepository.existsByAppointmentId(appointment.getId())) {
            throw new BadRequestException("You have already reviewed this appointment.");
        }

        Doctor doctor = appointment.getDoctor();

        Review review = new Review();
        review.setAppointment(appointment);
        review.setDoctor(doctor);
        review.setPatient(patient);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);

        // Notify Doctor
        if (notificationService != null && doctor.getUser() != null) {
            notificationService.createNotification(
                    doctor.getUser(),
                    "⭐ New Patient Review (" + request.getRating() + "/5 Stars)",
                    "Patient " + patient.getUser().getFullName() + " left feedback: \"" +
                            (request.getComment() != null && !request.getComment().isBlank() ? request.getComment() : "Great consultation") + "\""
            );
        }

        return mapToDto(saved);
    }

    @Override
    public List<ReviewDto> getDoctorReviews(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }
        return reviewRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorRatingSummaryDto getDoctorRatingSummary(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        List<Review> reviews = reviewRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
        long count = reviews.size();
        double avg = count > 0
                ? reviews.stream().mapToInt(Review::getRating).average().orElse(0.0)
                : 0.0;

        // Round to 1 decimal place
        double roundedAvg = Math.round(avg * 10.0) / 10.0;

        Map<Integer, Long> starCounts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int star = i;
            starCounts.put(star, reviews.stream().filter(r -> r.getRating() == star).count());
        }

        return new DoctorRatingSummaryDto(
                doctor.getId(),
                doctor.getUser().getFullName(),
                roundedAvg,
                count,
                starCounts
        );
    }

    @Override
    public List<ReviewDto> getPatientReviews(String patientEmail) {
        Patient patient = patientRepository.findByUserEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "email", patientEmail));

        return reviewRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReviewDto mapToDto(Review review) {
        return new ReviewDto(
                review.getId(),
                review.getAppointment().getId(),
                review.getDoctor().getId(),
                review.getDoctor().getUser().getFullName(),
                review.getPatient().getId(),
                review.getPatient().getUser().getFullName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
