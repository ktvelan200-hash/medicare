package com.medicare.service;

import com.medicare.dto.DoctorRatingSummaryDto;
import com.medicare.dto.ReviewDto;
import com.medicare.dto.ReviewRequestDto;

import java.util.List;

public interface ReviewService {

    ReviewDto createReview(String patientEmail, ReviewRequestDto request);

    List<ReviewDto> getDoctorReviews(Long doctorId);

    DoctorRatingSummaryDto getDoctorRatingSummary(Long doctorId);

    List<ReviewDto> getPatientReviews(String patientEmail);
}
