package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.DoctorDto;
import com.medicare.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@Tag(name = "Doctors", description = "Endpoints for searching and managing doctor profiles")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    @Operation(summary = "Get All Approved Doctors", description = "Fetch and filter doctors by specialization or search query")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getAllDoctors(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String query) {
        List<DoctorDto> doctors = doctorService.getAllApprovedDoctors(specialization, query);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Doctor By ID", description = "Fetch detailed doctor profile by doctor ID")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorById(@PathVariable Long id) {
        DoctorDto doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Get Current Doctor Profile", description = "Fetch current logged in doctor profile")
    public ResponseEntity<ApiResponse<DoctorDto>> getCurrentDoctor(Authentication authentication) {
        DoctorDto doctor = doctorService.getDoctorByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Update Doctor Profile", description = "Allows doctor to update specialization, qualification, fee, and bio")
    public ResponseEntity<ApiResponse<DoctorDto>> updateDoctorProfile(
            Authentication authentication,
            @RequestBody DoctorDto dto) {
        DoctorDto updated = doctorService.updateDoctorProfile(authentication.getName(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
