package com.medicare.service;

import com.medicare.dto.JwtAuthResponse;
import com.medicare.dto.LoginRequest;
import com.medicare.dto.RegisterRequest;
import com.medicare.dto.UserDto;

public interface AuthService {
    JwtAuthResponse login(LoginRequest loginRequest);
    JwtAuthResponse register(RegisterRequest registerRequest);
    UserDto getCurrentUser(String email);
}
