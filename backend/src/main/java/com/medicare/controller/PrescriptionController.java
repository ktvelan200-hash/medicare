package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.PrescriptionDto;
import com.medicare.dto.PrescriptionRequestDto;
import com.medicare.entity.Role;
import com.medicare.service.AuthService;
import com.medicare.service.PrescriptionService;
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
@RequestMapping("/api/prescriptions")
@Tag(name = "Prescriptions", description = "Endpoints for creating and viewing medical prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Create Prescription", description = "Doctor creates a prescription for a consultation")
    public ResponseEntity<ApiResponse<PrescriptionDto>> createPrescription(
            Authentication authentication,
            @Valid @RequestBody PrescriptionRequestDto request) {
        PrescriptionDto created = prescriptionService.createPrescription(authentication.getName(), request);
        return new ResponseEntity<>(ApiResponse.success("Prescription created successfully!", created), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "Get My Prescriptions", description = "Fetch prescriptions for current patient or doctor")
    public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getMyPrescriptions(Authentication authentication) {
        var user = authService.getCurrentUser(authentication.getName());
        List<PrescriptionDto> list;
        if (user.getRole() == Role.ROLE_PATIENT) {
            list = prescriptionService.getPatientPrescriptions(authentication.getName());
        } else {
            list = prescriptionService.getDoctorPrescriptions(authentication.getName());
        }
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/appointment/{appointmentId}")
    @Operation(summary = "Get Prescription By Appointment ID", description = "Fetch prescription linked to a specific appointment")
    public ResponseEntity<ApiResponse<PrescriptionDto>> getPrescriptionByAppointment(@PathVariable Long appointmentId) {
        PrescriptionDto dto = prescriptionService.getPrescriptionByAppointmentId(appointmentId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
