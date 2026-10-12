package com.medicare.service;

/**
 * Service for sending email notifications to patients and doctors.
 */
public interface EmailService {

    /**
     * Send a simple HTML email.
     */
    void sendEmail(String to, String subject, String htmlBody);

    /**
     * Send appointment confirmation to patient after booking.
     */
    void sendAppointmentConfirmation(String toEmail, String patientName,
                                     String doctorName, String date, String timeSlot);

    /**
     * Send appointment status update (confirmed / rejected / completed).
     */
    void sendAppointmentStatusUpdate(String toEmail, String patientName,
                                     String doctorName, String date, String status);

    /**
     * Send a 24-hour appointment reminder.
     */
    void sendAppointmentReminder(String toEmail, String patientName,
                                 String doctorName, String date, String timeSlot);

    /**
     * Notify doctor of a new appointment request.
     */
    void sendNewAppointmentAlertToDoctor(String toEmail, String doctorName,
                                          String patientName, String date, String timeSlot);

    /**
     * Notify patient when prescription is issued.
     */
    void sendPrescriptionIssuedNotification(String toEmail, String patientName,
                                             String doctorName, String diagnosis);

    /**
     * Notify doctor when their account profile is approved by Admin.
     */
    void sendDoctorApprovalNotification(String toEmail, String doctorName);

    /**
     * Notify doctor when their account profile is rejected by Admin.
     */
    void sendDoctorRejectionNotification(String toEmail, String doctorName, String reason);
}
