package com.medicare.controller;

import com.medicare.dto.*;
import com.medicare.service.AdminService;
import com.medicare.service.DoctorService;
import com.medicare.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Endpoints for platform administration, stats, and doctor verification")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/dashboard")
    @Operation(summary = "Admin Dashboard Statistics", description = "Returns total count of patients, doctors, pending approvals, and appointment metrics")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getDashboardStats() {
        AdminDashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get All Registered Users", description = "Fetch complete list of system users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Enable / Disable User Account", description = "Toggle active status for a user")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateDto statusUpdateDto) {
        UserDto updatedUser = userService.toggleUserStatus(id, statusUpdateDto.getEnabled());
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updatedUser));
    }

    // ── Doctor Verification Endpoints ─────────────────────────────────────────

    @GetMapping("/doctors/pending")
    @Operation(summary = "Get Pending Doctor Registrations", description = "Fetch doctors waiting for admin approval")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getPendingDoctors() {
        List<DoctorDto> doctors = doctorService.getPendingDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/doctors/pending/count")
    @Operation(summary = "Get Pending Doctor Count", description = "Returns the count of doctors awaiting admin approval")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getPendingDoctorsCount() {
        long count = doctorService.getPendingDoctorsCount();
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", count)));
    }

    @GetMapping("/doctors/{id}")
    @Operation(summary = "Get Doctor Details by ID", description = "Fetch full doctor profile for admin review")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorById(@PathVariable Long id) {
        DoctorDto doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @PutMapping("/doctors/{id}/approve")
    @Operation(summary = "Approve Doctor Registration", description = "Admin approves a pending doctor profile")
    public ResponseEntity<ApiResponse<DoctorDto>> approveDoctor(@PathVariable Long id) {
        DoctorDto updatedDoctor = doctorService.approveDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor approved successfully.", updatedDoctor));
    }

    @PutMapping("/doctors/{id}/reject")
    @Operation(summary = "Reject Doctor Registration", description = "Admin rejects a pending doctor profile with a reason")
    public ResponseEntity<ApiResponse<DoctorDto>> rejectDoctor(
            @PathVariable Long id,
            @RequestBody DoctorApprovalDto approvalDto) {
        DoctorDto updatedDoctor = doctorService.rejectDoctor(id, approvalDto.getRejectionReason());
        return ResponseEntity.ok(ApiResponse.success("Doctor rejected successfully.", updatedDoctor));
    }

    @PutMapping("/doctors/{id}/status")
    @Operation(summary = "Approve / Reject Doctor Registration (legacy)", description = "Admin approves or rejects a registered doctor profile")
    public ResponseEntity<ApiResponse<DoctorDto>> updateDoctorStatus(
            @PathVariable Long id,
            @Valid @RequestBody DoctorApprovalDto approvalDto) {
        DoctorDto updatedDoctor = doctorService.updateDoctorStatus(id, approvalDto.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Doctor status updated to " + approvalDto.getStatus(), updatedDoctor));
    }
}
