package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.JwtAuthResponse;
import com.medicare.dto.LoginRequest;
import com.medicare.dto.RegisterRequest;
import com.medicare.dto.UserDto;
import com.medicare.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration and JWT login")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticates user credentials and returns JWT token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "User Registration", description = "Registers a new patient or doctor account")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        JwtAuthResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(ApiResponse.success("Registration successful", response), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    @Operation(summary = "Current User Profile", description = "Returns details of currently authenticated user")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Authentication authentication) {
        UserDto userDto = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }
}
