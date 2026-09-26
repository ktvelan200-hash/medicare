package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.DoctorAvailabilityDto;
import com.medicare.service.DoctorAvailabilityService;
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
@Tag(name = "Doctor Availability", description = "Endpoints for doctor weekly schedule and availability")
public class DoctorAvailabilityController {

    @Autowired
    private DoctorAvailabilityService availabilityService;

    @GetMapping("/{id}/availability")
    @Operation(summary = "Get Doctor Availability", description = "Fetch weekly available days and time slots for a doctor")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityDto>>> getDoctorAvailability(@PathVariable Long id) {
        List<DoctorAvailabilityDto> list = availabilityService.getDoctorAvailability(id);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/availability")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Set Doctor Availability", description = "Update weekly available schedule for current doctor")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityDto>>> setDoctorAvailability(
            Authentication authentication,
            @RequestBody List<DoctorAvailabilityDto> availabilities) {
        List<DoctorAvailabilityDto> updated = availabilityService.setDoctorAvailability(authentication.getName(), availabilities);
        return ResponseEntity.ok(ApiResponse.success("Availability schedule updated successfully", updated));
    }
}
