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

    @GetMapping("/doctors/pending")
    @Operation(summary = "Get Pending Doctor Registrations", description = "Fetch doctors waiting for admin approval")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getPendingDoctors() {
        List<DoctorDto> doctors = doctorService.getPendingDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @PutMapping("/doctors/{id}/status")
    @Operation(summary = "Approve / Reject Doctor Registration", description = "Admin approves or rejects a registered doctor profile")
    public ResponseEntity<ApiResponse<DoctorDto>> updateDoctorStatus(
            @PathVariable Long id,
            @Valid @RequestBody DoctorApprovalDto approvalDto) {
        DoctorDto updatedDoctor = doctorService.updateDoctorStatus(id, approvalDto.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Doctor status updated to " + approvalDto.getStatus(), updatedDoctor));
    }
}
