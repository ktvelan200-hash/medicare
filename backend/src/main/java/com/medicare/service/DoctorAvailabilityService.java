package com.medicare.service;

import com.medicare.dto.DoctorAvailabilityDto;

import java.util.List;

public interface DoctorAvailabilityService {
    List<DoctorAvailabilityDto> setDoctorAvailability(String doctorEmail, List<DoctorAvailabilityDto> availabilities);
    List<DoctorAvailabilityDto> getDoctorAvailability(Long doctorId);
}
