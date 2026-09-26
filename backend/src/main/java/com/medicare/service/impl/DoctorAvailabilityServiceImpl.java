package com.medicare.service.impl;

import com.medicare.dto.DoctorAvailabilityDto;
import com.medicare.entity.Doctor;
import com.medicare.entity.DoctorAvailability;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.DoctorAvailabilityRepository;
import com.medicare.repository.DoctorRepository;
import com.medicare.service.DoctorAvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public List<DoctorAvailabilityDto> setDoctorAvailability(String doctorEmail, List<DoctorAvailabilityDto> dtos) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "email", doctorEmail));

        // Clear existing availabilities for doctor
        availabilityRepository.deleteByDoctorId(doctor.getId());

        List<DoctorAvailability> savedList = new ArrayList<>();
        for (DoctorAvailabilityDto dto : dtos) {
            DoctorAvailability availability = new DoctorAvailability();
            availability.setDoctor(doctor);
            availability.setDayOfWeek(dto.getDayOfWeek());
            availability.setStartTime(dto.getStartTime());
            availability.setEndTime(dto.getEndTime());
            availability.setMaxPatients(dto.getMaxPatients() != null ? dto.getMaxPatients() : 15);
            availability.setSlotDurationMinutes(dto.getSlotDurationMinutes() != null ? dto.getSlotDurationMinutes() : 30);
            savedList.add(availabilityRepository.save(availability));
        }

        return savedList.stream().map(modelMapper::mapToDoctorAvailabilityDto).collect(Collectors.toList());
    }

    @Override
    public List<DoctorAvailabilityDto> getDoctorAvailability(Long doctorId) {
        return availabilityRepository.findByDoctorId(doctorId).stream()
                .map(modelMapper::mapToDoctorAvailabilityDto)
                .collect(Collectors.toList());
    }
}
