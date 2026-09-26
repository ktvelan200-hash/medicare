package com.medicare.service;

import com.medicare.dto.UserDto;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto toggleUserStatus(Long id, boolean enabled);
}
