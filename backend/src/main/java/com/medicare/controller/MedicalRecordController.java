package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.MedicalRecordDto;
import com.medicare.entity.Role;
import com.medicare.service.AuthService;
import com.medicare.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@Tag(name = "Medical Records", description = "Endpoints for managing patient health & medical records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private AuthService authService;

    @GetMapping("/my")
    @Operation(summary = "Get My Medical Records", description = "Fetch medical records for current patient or doctor")
    public ResponseEntity<ApiResponse<List<MedicalRecordDto>>> getMyMedicalRecords(Authentication authentication) {
        var user = authService.getCurrentUser(authentication.getName());
        List<MedicalRecordDto> list;
        if (user.getRole() == Role.ROLE_PATIENT) {
            list = medicalRecordService.getPatientMedicalRecords(authentication.getName());
        } else {
            list = medicalRecordService.getDoctorMedicalRecords(authentication.getName());
        }
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    @Operation(summary = "Add Medical Record", description = "Add a new lab report, X-ray, or medical history entry")
    public ResponseEntity<ApiResponse<MedicalRecordDto>> addMedicalRecord(
            Authentication authentication,
            @RequestBody MedicalRecordDto recordDto) {
        MedicalRecordDto created = medicalRecordService.addMedicalRecord(authentication.getName(), recordDto);
        return new ResponseEntity<>(ApiResponse.success("Medical record added successfully", created), HttpStatus.CREATED);
    }
}
