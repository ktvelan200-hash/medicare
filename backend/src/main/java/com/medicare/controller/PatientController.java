package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.PatientProfileDto;
import com.medicare.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@Tag(name = "Patients", description = "Endpoints for viewing and managing patient profiles")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Get Current Patient Profile", description = "Fetch details of currently logged in patient")
    public ResponseEntity<ApiResponse<PatientProfileDto>> getCurrentPatient(Authentication authentication) {
        PatientProfileDto patient = patientService.getPatientByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Update Patient Profile", description = "Update patient personal details and medical history")
    public ResponseEntity<ApiResponse<PatientProfileDto>> updatePatientProfile(
            Authentication authentication,
            @RequestBody PatientProfileDto dto) {
        PatientProfileDto updated = patientService.updatePatientProfile(authentication.getName(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @Operation(summary = "Get Patient By ID", description = "Fetch patient profile for doctors or admins")
    public ResponseEntity<ApiResponse<PatientProfileDto>> getPatientById(@PathVariable Long id) {
        PatientProfileDto patient = patientService.getPatientProfile(id);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @Operation(summary = "Get All Patients", description = "Fetch list of all patients for doctors or admins")
    public ResponseEntity<ApiResponse<List<PatientProfileDto>>> getAllPatients() {
        List<PatientProfileDto> patients = patientService.getAllPatients();
        return ResponseEntity.ok(ApiResponse.success(patients));
    }
}
