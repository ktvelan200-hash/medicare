package com.medicare.dto;

import java.util.Map;

public class DoctorRatingSummaryDto {
    private Long doctorId;
    private String doctorName;
    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> starCounts; // count of 5-star, 4-star, 3-star, 2-star, 1-star reviews

    public DoctorRatingSummaryDto() {}

    public DoctorRatingSummaryDto(Long doctorId, String doctorName, Double averageRating, Long totalReviews, Map<Integer, Long> starCounts) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.starCounts = starCounts;
    }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Long totalReviews) { this.totalReviews = totalReviews; }

    public Map<Integer, Long> getStarCounts() { return starCounts; }
    public void setStarCounts(Map<Integer, Long> starCounts) { this.starCounts = starCounts; }
}
