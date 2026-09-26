package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.AppointmentRequestDto;
import com.medicare.dto.AppointmentResponseDto;
import com.medicare.dto.AppointmentStatusUpdateDto;
import com.medicare.entity.Role;
import com.medicare.service.AppointmentService;
import com.medicare.service.AuthService;
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
@RequestMapping("/api/appointments")
@Tag(name = "Appointments", description = "Endpoints for booking, updating, and cancelling appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Book Appointment", description = "Patient books a doctor appointment. Prevents double booking.")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> bookAppointment(
            Authentication authentication,
            @Valid @RequestBody AppointmentRequestDto request) {
        AppointmentResponseDto response = appointmentService.bookAppointment(authentication.getName(), request);
        return new ResponseEntity<>(ApiResponse.success("Appointment booked successfully!", response), HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "Get My Appointments", description = "Fetch appointments for current patient or doctor")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDto>>> getMyAppointments(Authentication authentication) {
        var user = authService.getCurrentUser(authentication.getName());
        List<AppointmentResponseDto> appointments;
        if (user.getRole() == Role.ROLE_PATIENT) {
            appointments = appointmentService.getPatientAppointments(authentication.getName());
        } else if (user.getRole() == Role.ROLE_DOCTOR) {
            appointments = appointmentService.getDoctorAppointments(authentication.getName());
        } else {
            appointments = appointmentService.getAllAppointments();
        }
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Appointment By ID", description = "Fetch details of a single appointment")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> getAppointmentById(@PathVariable Long id) {
        AppointmentResponseDto appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.success(appointment));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @Operation(summary = "Update Appointment Status", description = "Doctor accepts, rejects, or completes appointment")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> updateAppointmentStatus(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody AppointmentStatusUpdateDto updateDto) {
        AppointmentResponseDto updated = appointmentService.updateAppointmentStatus(id, authentication.getName(), updateDto);
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated to " + updateDto.getStatus(), updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Cancel Appointment", description = "Patient cancels an upcoming appointment")
    public ResponseEntity<ApiResponse<AppointmentResponseDto>> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication) {
        AppointmentResponseDto cancelled = appointmentService.cancelAppointment(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", cancelled));
    }
}
