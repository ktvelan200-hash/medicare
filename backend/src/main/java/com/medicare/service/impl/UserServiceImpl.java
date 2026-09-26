package com.medicare.service.impl;

import com.medicare.dto.UserDto;
import com.medicare.entity.User;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.UserRepository;
import com.medicare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(modelMapper::mapToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return modelMapper.mapToUserDto(user);
    }

    @Override
    public UserDto toggleUserStatus(Long id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setEnabled(enabled);
        User updated = userRepository.save(user);
        return modelMapper.mapToUserDto(updated);
    }
}
