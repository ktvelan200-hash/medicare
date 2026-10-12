package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.DoctorRatingSummaryDto;
import com.medicare.dto.ReviewDto;
import com.medicare.dto.ReviewRequestDto;
import com.medicare.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "Endpoints for doctor ratings and patient feedback reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Submit Doctor Review", description = "Patient submits star rating and feedback for completed appointment")
    public ResponseEntity<ApiResponse<ReviewDto>> submitReview(
            @Valid @RequestBody ReviewRequestDto request,
            Authentication authentication) {
        ReviewDto created = reviewService.createReview(authentication.getName(), request);
        return new ResponseEntity<>(ApiResponse.success("Thank you! Your doctor review has been submitted.", created), HttpStatus.CREATED);
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get Doctor Reviews", description = "Fetch all patient reviews for a specific doctor")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getDoctorReviews(@PathVariable Long doctorId) {
        List<ReviewDto> reviews = reviewService.getDoctorReviews(doctorId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/doctor/{doctorId}/summary")
    @Operation(summary = "Get Doctor Rating Summary", description = "Fetch average rating and star breakdown for a doctor")
    public ResponseEntity<ApiResponse<DoctorRatingSummaryDto>> getDoctorRatingSummary(@PathVariable Long doctorId) {
        DoctorRatingSummaryDto summary = reviewService.getDoctorRatingSummary(doctorId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Get My Reviews", description = "Fetch all reviews submitted by the authenticated patient")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getMyReviews(Authentication authentication) {
        List<ReviewDto> reviews = reviewService.getPatientReviews(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }
}
