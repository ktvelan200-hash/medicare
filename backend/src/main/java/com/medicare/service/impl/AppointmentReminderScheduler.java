package com.medicare.service.impl;

import com.medicare.entity.Appointment;
import com.medicare.entity.AppointmentStatus;
import com.medicare.repository.AppointmentRepository;
import com.medicare.service.EmailService;
import com.medicare.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * Scheduled service that runs every hour and sends 24-hour appointment reminders
 * to patients and doctors whose appointments are scheduled for tomorrow.
 */
@Service
public class AppointmentReminderScheduler {

    private static final Logger log = LoggerFactory.getLogger(AppointmentReminderScheduler.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    /**
     * Runs every hour. Finds appointments scheduled for tomorrow with CONFIRMED status
     * and sends email + in-app reminder notifications.
     *
     * Cron: "0 0 * * * *" = top of every hour
     */
    @Scheduled(cron = "0 0 * * * *")
    public void sendUpcomingAppointmentReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        log.info("[SCHEDULER] Checking reminders for date: {}", tomorrow);

        List<AppointmentStatus> activeStatuses = Arrays.asList(
                AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING);

        List<Appointment> upcomingAppointments =
                appointmentRepository.findByAppointmentDateAndStatusIn(tomorrow, activeStatuses);

        log.info("[SCHEDULER] Found {} appointments to remind for {}", upcomingAppointments.size(), tomorrow);

        for (Appointment appt : upcomingAppointments) {
            try {
                String patientName = appt.getPatient().getUser().getFullName();
                String patientEmail = appt.getPatient().getUser().getEmail();
                String doctorName = appt.getDoctor().getUser().getFullName();
                String date = appt.getAppointmentDate().toString();
                String timeSlot = appt.getTimeSlot();

                // Send email reminder to patient
                emailService.sendAppointmentReminder(patientEmail, patientName, doctorName, date, timeSlot);

                // Send in-app notification to patient
                notificationService.createNotification(
                        appt.getPatient().getUser(),
                        "⏰ Appointment Reminder",
                        "Reminder: You have an appointment with Dr. " + doctorName +
                        " tomorrow (" + date + ") at " + timeSlot
                );

                // Send in-app notification to doctor
                notificationService.createNotification(
                        appt.getDoctor().getUser(),
                        "📋 Upcoming Appointment",
                        "Reminder: You have an appointment with patient " + patientName +
                        " tomorrow (" + date + ") at " + timeSlot
                );

                log.info("[SCHEDULER] Reminder sent for appointment #{} (Patient: {}, Doctor: {})",
                        appt.getId(), patientName, doctorName);

            } catch (Exception e) {
                log.error("[SCHEDULER] Failed to send reminder for appointment #{}: {}",
                        appt.getId(), e.getMessage());
            }
        }
    }
}
